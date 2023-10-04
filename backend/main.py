from json import dumps
from bson.objectid import ObjectId
from typing import Union, List
import re
from fastapi import FastAPI, Response, status, Query, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import ssl
from templates.email_temp import get_email_temp
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler

# mongo imports
from pymongo import MongoClient
from bson.objectid import ObjectId

from bson.json_util import dumps
from db.recipes import (
    RecipeSchema,
    RecipePayload,
    RecipeSchema,
    recipe_payload_to_mongo_schema,
)
from ingredients import getIngredientsList, ingExists
from ingredientsData import populateIngList
from db.users import (
    NewUserPayload,
    UserMongoSchema,
    IngredientMongoSchema,
    IngredientPayload,
    ListsMongoSchema,
    ListsPayload,
    MealPlanPayload,
    MealPlanMongoSchema,
    MoveMealPlanPayload,
    MoveRecipePayload,
    ResetPassword,
    TokenData,
)

from auth import (
    verify_password,
    get_hashed_password,
    verify_email,
    verify_username,
    create_token,
    get_current_user,
    check_email,
    check_code,
    change_username,
    change_email,
    change_password,
)

from sortAndFilter import (
    grab_filtered_recipes,
    sortRecipeResults
)

from expiryDates import (
    add_expiry_date,
    change_expiry_date,
    del_expiry_date,
    get_expiry_date,
    get_notif,
    auto_check_notifs,
)

from ratings import (
    cal_taste_rating,
    cal_diff_rating,
    cal_time_rating,
    del_taste_rating,
    del_diff_rating,
    del_time_rating,
    change_taste_rating,
    change_diff_rating,
    change_time_rating,
    get_diff_rating,
    get_taste_rating,
    get_time_rating,
)

from recipeSearch import recipe_search, RecipeSearchPayload


# connect to MongoDB
client = MongoClient(
    "mongodb+srv://mif:VmkdZIBpqco1MPQ4@cluster0.htxrp.mongodb.net/?retryWrites=true&w=majority"
)
recipes_db = client.foodle.recipes
users_db = client.foodle.users

populateIngList()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Making Scheduler for Notifications
sched = BackgroundScheduler()
# Check notifications at the start of every day (i.e. at midnight)
sched.add_job(auto_check_notifs, 'cron', hour = 0)
sched.start()

# Email Settings for password reset
smtp_server = "smtp.gmail.com"
port = 587
sender_email = 'matkha3900@gmail.com'
password = "uiphqmfrvoyuxsij"

@app.get("/api/foodle")
async def homepage():
    return dumps(list(recipes_db.find().sort([('has_ratings', -1),("ratings", -1)])))


'''
Recipe
'''
@app.post("/api/recipe", status_code=status.HTTP_201_CREATED)
async def new_recipe(payload: RecipePayload, current_user: TokenData = Depends(get_current_user)):
    recipe = recipe_payload_to_mongo_schema(payload).dict()
    recipes_db.insert_one(recipe)
    # Add to the user's list of personal recipes
    users_db.update_one({'user_name': current_user.username}, {'$addToSet': {'my_recipes': recipe}}, upsert=True)
    return


@app.put("/api/recipe/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_recipe(id, payload: RecipePayload, response: Response):
    recipe = recipe_payload_to_mongo_schema(payload)
    result = recipes_db.update_one({"_id": ObjectId(id)}, recipe)
    if result.matched_count == 0:
        response.status_code = status.HTTP_304_NOT_MODIFIED
    return

# Return full recipe details given a recipe id
@app.get("/api/recipe/{id}", response_model=Union[RecipeSchema, None])
async def get_recipe_details(id: str):
    recipe = recipes_db.find_one({"_id": ObjectId(id)}, {"_id": 0})
    recipe['_id'] = id
    return recipe

# Return a user's My Ingredients as a list
@app.get("/api/user/myingredients")
async def my_ingredients(current_user: TokenData = Depends(get_current_user)):
    user_name = current_user.username
    user = users_db.find_one({"user_name": user_name}, {'my_ingredients': 1, '_id': 0})
    ingList = {"categories": []}
    for ing in user['my_ingredients']:
        added = False
        for x in ingList["categories"]:
            if ing['category'] == x['categoryName']:
                x["ingredients"].append(ing["name"])
                added = True
        if added == False:
            ingList["categories"].append({"categoryName":ing['category'], "ingredients": [ing["name"]] })
    return dumps(ingList)

# Add a new ingredient into the user's My Ingredients list
@app.post("/api/user/myingredients/add")
async def add_ingredient(payload: IngredientPayload, current_user: TokenData = Depends(get_current_user)):
    user_name = current_user.username
    ing = IngredientMongoSchema(name=payload.ingredient, category=payload.category).dict()
    users_db.update_one({'user_name': user_name}, {'$addToSet': {'my_ingredients': ing}}, upsert=True)
    return

# Remove an ingredient into the user's My Ingredients list
@app.put("/api/user/myingredients/remove")
async def remove_ingredient(payload: IngredientPayload, current_user: TokenData = Depends(get_current_user)):
    user_name = current_user.username
    ing = IngredientMongoSchema(name=payload.ingredient, category=payload.category).dict()
    users_db.update_one({'user_name': user_name}, {'$pull': {'my_ingredients': ing}})
    return


'''
Recipe Lists
'''
@app.get("/api/user/myLists")
async def get_lists(user: TokenData = Depends(get_current_user)):
    '''
    Returns all lists user has
    '''
    user_info = users_db.find_one({'user_name': user.username})
    return dumps(user_info["my_lists"])

@app.post("/api/user/mylists/createUpdateList")
async def create_list(payload: ListsPayload, user: TokenData = Depends(get_current_user)):
    '''
    Create list if list with given name does not exist
    If list with given name exists, adds given recipes to existing list
    '''
    user_name = user.username
    newList = ListsMongoSchema(name=payload.name, recipes=payload.recipes).dict()
    curLists = users_db.find({'user_name': user_name}, {"_id":0, 'my_lists.name': 1}, )
    for l in curLists:
        if {'name': payload.name} in l['my_lists']:
            users_db.update_one({'user_name': user_name, 'my_lists.name': payload.name}, {'$addToSet': {'my_lists.$.recipes': {"$each": payload.recipes}}})
            return
    users_db.update_one({'user_name': user_name}, {'$addToSet': {'my_lists': newList}}, upsert=True)
    return

@app.put("/api/user/mylists/removeList")
async def remove_list(list_name: str, user: TokenData = Depends(get_current_user)):
    '''
    Removes list with given name from user's lists
    '''
    user_name = user.username
    users_db.update_one({'user_name': user_name}, {'$pull': {'my_lists': {'name': list_name}}})
    return

@app.put("/api/user/mylists/removeRecipesFromList")
async def remove_recipes_from_list(payload:  ListsPayload, user: TokenData = Depends(get_current_user)):
    '''
    Removes recipes from existing list. Can remove both one and multiple recipes from one list
    '''
    user_name = user.username
    name = payload.name
    recipes = payload.recipes
    users_db.update_one({'user_name': user_name, 'my_lists.name': name}, {'$pull': {'my_lists.$.recipes': {"$in": recipes}}})
    return
'''
Calendar
'''
@app.post("/api/user/myCalendar/addMealPlan")
async def add_meal_plan(payload: MealPlanPayload, user: TokenData = Depends(get_current_user)):
    '''
    Adds new meal plan to date, if meal plan exists updates the recipes within the existing meal plan.
    MealPlanPayload format: {date:"",meal:"",recipes:[]}
    '''
    user_name = user.username
    newMealPlan = MealPlanMongoSchema(date=payload.date, meal=payload.meal, recipes=payload.recipes).dict()
    curMealPlans = users_db.find({'user_name': user_name}, {"_id":0, 'my_calendar.date': 1, 'my_calendar.meal': 1})
    for l in curMealPlans:
        if {"meal":payload.meal, "date":payload.date} in l['my_calendar']:
            users_db.update_one(
                {'user_name': user_name}, 
                {'$addToSet': {'my_calendar.$[elem].recipes': {"$each": payload.recipes}}},
                array_filters=[
                    {"elem.meal": payload.meal,"elem.date": payload.date}
                ]
            )
        else:
            users_db.update_one({'user_name': user_name}, {'$addToSet': {'my_calendar': newMealPlan}}, upsert=True)
    return

@app.get("/api/user/myCalendar/")
async def get_plans_on_date(date: str, user: TokenData = Depends(get_current_user)):
    '''
    Returns meals plans on one date
    '''
    user_name = user.username
    userCalendar = users_db.find_one({'user_name': user_name})
    if userCalendar["my_calendar"] == []:
        return []

    mealPlans = users_db.aggregate([
        {
            "$match": {
                "user_name": user_name,
                "my_calendar.date": date,
            }
        },
        {
            "$project": {
                "_id":0,
                "my_calendar": {
                    "$filter": {
                        "input": "$my_calendar",
                        "as": "list",
                        "cond": {"$in": ["$$list.date",[date]]},
                    }
                }
            }
        }
    ])
    for l in mealPlans:
        return dumps(l)
    return []


@app.put("/api/user/myCalendar/removeMealPlan")
async def remove_meal_plan(date: str, meal: str, user: TokenData = Depends(get_current_user)):
    '''
    Removes one meal plan from date
    '''
    user_name = user.username
    users_db.update_one({'user_name': user_name}, {'$pull': {'my_calendar': {"date": date, 'meal': meal}}})
    return

@app.put("/api/user/myCalendar/removeRecipesFromMealPlan")
async def remove_recipes_from_meal_plan(payload: MealPlanPayload, user: TokenData = Depends(get_current_user)):
    '''
    Removes recipes from a meal plan, can remove both one recipe and many recipes
    '''
    user_name = user.username
    meal = payload.meal
    recipes = payload.recipes
    date = payload.date
    users_db.update_one({'user_name': user_name}, 
        {'$pull': {'my_calendar.$[elem].recipes': 
            {"$in": recipes}}},
        array_filters=[
            {"elem.meal": meal,"elem.date": date}
        ]
    )
    return 

@app.post("/api/user/myCalendar/moveMealPlan")
async def move_meal_plan(payload: MoveMealPlanPayload, user: TokenData = Depends(get_current_user)):
    '''
    Changes the date of a meal plan
    '''
    user_name = user.username

    mealPlans = users_db.find({'user_name': user_name}, {"_id":0, 'my_calendar':1})
    mealPlans = list(mealPlans)[0]['my_calendar']
    oldRecipes = []
    for l in mealPlans:
        if l['date'] == payload.oldDate and l['meal'] == payload.oldMeal:
            oldRecipes = l['recipes']
            users_db.update_one({'user_name': user_name, 'my_calendar.date': payload.oldDate, 'my_calendar.meal': payload.oldMeal}, {'$pull': {'my_calendar':{'meal':payload.oldMeal, 'date':payload.oldDate}}})
            break

    for l in mealPlans:
        if l['date'] == payload.newDate and l['meal'] == payload.newMeal:
            users_db.update_one(
                {'user_name': user_name}, 
                {'$addToSet': {'my_calendar.$[elem].recipes': {"$each": oldRecipes}}},
                array_filters=[
                    {"elem.meal": payload.meal,"elem.date": payload.date}
                ]
            )
            return

    newMealPlan = MealPlanMongoSchema(date=payload.newDate, meal=payload.newMeal, recipes=oldRecipes).dict()
    users_db.update_one({'user_name': user_name}, {'$addToSet': {'my_calendar': newMealPlan}}, upsert=True)

@app.post("/api/user/myCalendar/moveRecipe")
async def move_recipe_to_meal_plan(payload: MoveRecipePayload, user: TokenData = Depends(get_current_user)):
    '''
    Moves one recipe to a new meal plan, new meal plan can be of the same date or different date.
    Single recipe can be moved to meal plans that already exist and to meal plans that don't exist already
    '''
    user_name = user.username
    # remove recipe from old meal plan
    users_db.update_one({'user_name': user_name}, 
        {'$pull': {'my_calendar.$[elem].recipes': payload.recipe}},
        array_filters=[
            {"elem.meal": payload.oldMeal,"elem.date": payload.oldDate}
        ]
    )
    #checkd if new meal plan exists and then adds recipe
    mealPlanCheck = users_db.find({'user_name': user_name}, {"_id":0, 'my_calendar.date': 1, 'my_calendar.meal': 1})
    for l in mealPlanCheck:
        if {"date":payload.newDate, "meal":payload.newMeal} in l['my_calendar']:
            #TODO return clarification string if recipe already exists
            users_db.update_one(
                {'user_name': user_name}, 
                {'$addToSet': {'my_calendar.$[elem].recipes': payload.recipe}},
                array_filters=[
                    {"elem.meal": payload.newMeal,"elem.date": payload.newDate}
                ]
            )
        else:
            newMealPlan = MealPlanMongoSchema(meal=payload.newMeal, date=payload.newDate, recipes=[payload.recipe]).dict()
            users_db.update_one({'user_name': user_name}, {'$addToSet': {'my_calendar': newMealPlan}}, upsert=True)

'''
Ingredients List
'''
@app.get("/api/ingredients")
async def ingredientsList():
    return dumps(getIngredientsList())

class IngredientPayload(BaseModel):
    ingredient: str
    category: str

@app.post("/api/ingredientsuggestion", status_code=status.HTTP_202_ACCEPTED)
async def suggestIngredient(payload: IngredientPayload):
    ingredientCategories = getIngredientsList()
    if payload.category not in map(lambda x: x['categoryName'], ingredientCategories['categories']):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category does not exist")
    if ingExists(payload.ingredient):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ingredient already exists")
    return


'''
Register and Login
'''
@app.post('/api/register')
async def create_user(payload: NewUserPayload):
    # Check email and username, if both valid then register the user
    if not verify_username(payload.user_name):
        return {"message": "Username has already been registered"}
    if not verify_email(payload.email):
        return {"message": "Email is invalid"}
    hashed_pass = get_hashed_password(payload.password)
    user_data = UserMongoSchema(
        user_name=payload.user_name,
        email=payload.email,
        hashed_password=hashed_pass
    )
    user = user_data.dict()
    users_db.insert_one(user)
    return {"message":"created"}

@app.post('/api/login')
async def login(payload:OAuth2PasswordRequestForm = Depends()):
    user = users_db.find_one({"user_name":payload.username}, {'user_name': 1, 'hashed_password': 1, '_id': 0})
    if verify_username(payload.username):
       raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = f'No user found with this {payload.username} username')
    if not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = f'Incorrect password')
    access_token = create_token(data={"name": user["user_name"] })
    return {"access_token": access_token, "token_type": "bearer"}


@app.post('/api/forgotpassword/request')
async def forgot_password_request(email):
    result = check_email(email)
    if result is False:
        return {'message': 'Invalid email for password reset'}
    receiver_email = [email]
    msg = MIMEMultipart()
    msg["Subject"] = "Foodle Password Reset Code"
    msg["From"] = sender_email
    msg['To'] = ", ".join(receiver_email)
    text = get_email_temp(result)
    body_text = MIMEText(text, 'html')
    msg.attach(body_text)

    context = ssl.create_default_context()
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo() 
        server.starttls(context=context)
        server.ehlo()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
    except Exception as e:
        print(e)
    finally:
        server.quit()

    return {'message': 'success'}

@app.post('/api/forgotpassword/reset')
async def forgot_password_request(payload: ResetPassword):
    if not check_code(payload.code, payload.new_password):
        return {'message':'Reset Code is Invalid'}
    else:
        return {'message': 'Password reset, please try login again'}


@app.get("/api/myingredients/search")
async def searchRecipe(user_name: str = None, 
    sort: Union[str, None] = None,  order: Union[str, None] = None, 
    diet: Union[List[str], None] = Query(default=None, max_length=50),
    exclude: Union[List[str], None] = Query(default=None, max_length=500), 
    num_servings: Union[int, None] = None, time: Union[List[int], None] = Query(default=None),
    meal_type: Union[str, None] = None, 
):
    include = []
    if user_name:
        myIng = users_db.find({"user_name": user_name},{"my_ingredients.name": 1, "_id":0})
        if myIng:
            for i in myIng:
                for item in i['my_ingredients']:
                    include.append(re.compile(".*"+item['name']+".*", re.IGNORECASE))
                    
    if exclude:
        for i in range(len(exclude)):
            exclude[i] = re.compile(".*" + exclude[i] + ".*", re.IGNORECASE)

    # Default order is by rating and in descending order
    sortNullVal = ""
    if sort is None:
        sort = "rating"
    if sort == "rating":
        sortNullVal = "has_ratings"
    if sort == "time":
        sort = "time_int"
        sortNullVal = "has_time"
    if order is None:
        order = -1
    elif order == "low":
        order = 1
    elif order == "high":
        order = -1

    #Get filtered results
    result = grab_filtered_recipes(num_servings, meal_type, time, diet, include, exclude, recipes_db)
    #If no ingredients selected in query, no need to sort by number of matching ingredients
    if include == []:
        return dumps(list(result.sort([(sortNullVal, -1),(sort, order), ("_id", 1)])))
    
    # Sort result by number of matching ingredients and time and rating if needed
    sortedRecipeResult = sortRecipeResults(result, include, order, sort)
    
    #Get full recipe details
    fullRecipes = []
    for result in sortedRecipeResult:
        fullRecipes.append(recipes_db.find_one({"_id": ObjectId(result[0])}))

    return dumps(fullRecipes)

# Get username
@app.get('/api/get/user')
async def get_user(current_user: TokenData = Depends(get_current_user)):
    return current_user.username

# Get user details except calendar cos it's messy
@app.get('/api/get/user/data')
async def get_user_data(current_user: TokenData = Depends(get_current_user)):
    user = users_db.find_one({"user_name":current_user.username}, {'user_name': 1, 'email': 1, 'my_lists': 1, 'my_recipes': 1, '_id': 0})
    return dumps(user)

# Change username and return updated token
@app.post('/api/change/username')
async def change_user_name(new_username, current_user: TokenData = Depends(get_current_user)):
    change_username(current_user.username, new_username)
    access_token = create_token(data={"sub": new_username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post('/api/change/email')
async def change__user_email(new_email, current_user: TokenData = Depends(get_current_user)):
    change_email(current_user.username, new_email)
    return {"message": 'email changed'}

@app.post('/api/change/password')
async def change_user_password(old_password, new_password, current_user: TokenData = Depends(get_current_user)):
    if not change_password(current_user.username, old_password, new_password):
        return {"message": 'incorrect password'}
    return {"message": 'password changed'}


# Expiry date
@app.get('/api/get/notifications')
async def get_notifications(current_user: TokenData = Depends(get_current_user)):
    return get_notif(current_user.username)

@app.get('/api/get/expirydate')
async def get_expirydate(ingredient, current_user: TokenData = Depends(get_current_user)):
    return get_expiry_date(current_user.username, ingredient)

@app.post('/api/add/expirydate')
async def add_expirydate(ingredient, date, current_user: TokenData = Depends(get_current_user)):
    add_expiry_date(current_user.username, ingredient, date)
    return {'message': 'date added'}

@app.post('/api/change/expirydate')
async def change_expirydate(ingredient, date, current_user: TokenData = Depends(get_current_user)):
    change_expiry_date(current_user.username, ingredient, date)
    return {'message': 'date changed'}

@app.post('/api/delete/expirydate')
async def delete_expirydate(ingredient, current_user: TokenData = Depends(get_current_user)):
    del_expiry_date(current_user.username, ingredient)
    return {'message': 'date deleted'}

# Ratings
@app.post('/api/change/timerating')
async def change_timerating(recipeId, rating, current_user: TokenData = Depends(get_current_user)):
    change_time_rating(recipeId, current_user.username, rating)
    cal_time_rating(recipeId)
    return

@app.post('/api/change/tasterating')
async def change_tasterating(recipeId, rating, current_user: TokenData = Depends(get_current_user)):
    change_taste_rating(recipeId, current_user.username, rating)
    avg = cal_taste_rating(recipeId)
    recipes_db.update_one({"_id": ObjectId(recipeId)}, {'$set': {'rating': avg}})
    return


@app.post('/api/change/diffrating')
async def change_diffrating(recipeId, rating, current_user: TokenData = Depends(get_current_user)):
    change_diff_rating(recipeId, current_user.username, rating)
    cal_diff_rating(recipeId)
    return

@app.post('/api/del/timerating')
async def del_timerating(recipeId, current_user: TokenData = Depends(get_current_user)):
    del_time_rating(recipeId, current_user.username)
    return

@app.post('/api/del/tasterating')
async def del_tasterating(recipeId, current_user: TokenData = Depends(get_current_user)):
    del_taste_rating(recipeId, current_user.username)
    avg = cal_taste_rating(recipeId)
    recipes_db.update_one({"_id": ObjectId(recipeId)}, {'$set': {'rating': avg}})
    return

@app.post('/api/del/diffrating')
async def del_diffrating(recipeId, current_user: TokenData = Depends(get_current_user)):
    del_diff_rating(recipeId, current_user.username)
    return

@app.get('/api/get/diffrating')
async def get_diffrating(recipeId):
    return get_diff_rating(recipeId)

@app.get('/api/get/tasterating')
async def get_tasterating(recipeId):
    return get_taste_rating(recipeId)

@app.get('/api/get/timerating')
async def get_timerating(recipeId):
    return get_time_rating(recipeId)

@app.post('/api/recipe/search')
async def get_recipe_search(payload: RecipeSearchPayload):
    return recipe_search(payload.keywords)

@app.post('/api/ingredient/search')
async def get_recipe_with_only_these_ingredients(ingredients: List[str]):
    result = recipes_db.find({"ingredients_index": {"$all": ingredients, "$size": len(ingredients)}})
    return dumps(list(result))

if __name__ == "__main__":
    print("yo")

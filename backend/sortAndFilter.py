from json import dumps
import re

from operator import getitem
from bson import ObjectId

def grab_filtered_recipes(num_servings, meal_type, time, diet, include, exclude, recipes_db):
    # Values used if these values are not none
    inKey = ''
    exKey = ''
    if include != [] and exclude is not None:
        inKey = "$in"
        exKey = "$nin"
    elif include == [] and exclude is not None:
        inKey = "$nin"
        exKey  = "$nin"
    elif include != [] and exclude is None:
        exclude = []
        exKey = "$nin"
        inKey = "$in"
    elif include == [] and exclude is None:
        exclude = []
        exKey = "$nin"
        inKey = "$nin"
    
    num_servings1 = num_servings
    num_servings2 = num_servings
    if num_servings is None:
        num_servings = 999999
        num_servings1 = -999999
        num_servings2 = None

    meal_type1 = meal_type
    if meal_type is None:
        meal_type = re.compile(".*")
        meal_type1 = None

    lowTime = ""
    highTime = ""
    timeNull = ""
    if time is None:
        lowTime = -9999999
        highTime = 9999999
        timeNull = None
    else:
        lowTime = time[0]
        highTime = time[1]
        timeNull = (time[0] + time[1])/2

    diet1 = diet
    opKey2 = "$all"
    if diet is None:
        opKey2 = "$exists"
        diet = "false"
        diet1 = 'true'
    
        
    return recipes_db.find({"$and":[
        {"ingredients":{inKey: include}},
        {"ingredients":{exKey: exclude}},
        {"$or":[
            {"$and":[{"servings_int": {"$lte": num_servings}}, {"servings_int": {"$gte": num_servings1}}]},
            {"servings_int": num_servings2}]}, 
        {"$or":[{"meal_type": meal_type}, {"meal_type": meal_type1}]}, 
        {"$or":[
            {"$and":[{"time_int": {"$gte": lowTime}}, {"time_int": {"$lte": highTime}}]}, 
            {"time_int": timeNull}]},
        {"$or": [{"dietary_requirements": {opKey2: diet}}, {"dietary_requirements": {opKey2: diet1}}]}
        ]}
    )

def sortRecipeResults(result, include, order, sort):
    queryResult = {}
    for recipe in result:
        numMatchIng = 0
        copy = include.copy()
        for recIng in recipe['ingredients']:
            for ing in copy:
                if ing.match(recIng):
                    numMatchIng += 1
                    copy.remove(ing)
        
        id = str(recipe['_id'])
        try:
            rating = recipe["rating"]
        except:
            rating = None
        try:
            time = recipe['time_int']
        except:
            time = None

        #Time unchanged will be sorted in descending order, -time sorts in ascending
        if time is not None and order == 1:
            time = -time
        if rating is not None and order == 1:
            rating = -rating

        queryResult[id] = {
            "matchIng": numMatchIng,
            "rating": rating,
            "time_int": time,
        }

    #Default sort is by descending rating and then descending id
    if sort == "time_int":
        queryResult = sorted(queryResult.items(), key=lambda x: (getitem(x[1], 'matchIng'), getitem(x[1], 'time_int') is not None, getitem(x[1], 'time_int'), x[0]), reverse=True)
    elif sort == "rating":
        queryResult = sorted(queryResult.items(), key=lambda x: (getitem(x[1], 'matchIng'), getitem(x[1], 'rating') is not None, getitem(x[1], 'rating'), x[0]), reverse=True)
    return queryResult
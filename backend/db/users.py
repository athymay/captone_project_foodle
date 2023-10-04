from re import S
from typing import List, Union
from pydantic import BaseModel

class NewUserPayload(BaseModel):
    user_name: str
    email: str
    password: str

class IngredientPayload(BaseModel):
    ingredient: str
    category: str

class IngredientMongoSchema(BaseModel):
    name: str
    category: str
    expiry_date: str = None
    notif: bool = False

class NotificationMongoSchema(BaseModel):
    ingredient: str
    expiry_date: str
    message: str

class ListsPayload(BaseModel):
    name: str
    recipes: List[str] = None

class ListsMongoSchema(BaseModel):
    name: str
    recipes: List[str] = None

class MealPlanPayload(BaseModel):
    date: str
    meal: str
    recipes: List[str]

class MealPlanMongoSchema(BaseModel):
    date: str
    meal: str
    recipes: List[str]

class MoveMealPlanPayload(BaseModel):
    newMeal: str
    newDate: str
    oldMeal: str
    oldDate: str
    

class MoveRecipePayload(BaseModel):
    recipe: str
    oldMeal: str
    newMeal: str
    oldDate: str
    newDate: str

class UserMongoSchema(BaseModel):
    user_name: str
    email: str
    hashed_password: str
    reset_code: str = None
    my_ingredients: List[IngredientMongoSchema] = []
    my_lists: List[ListsMongoSchema] = []
    my_calendar: List[MealPlanMongoSchema] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class ResetPassword(BaseModel):
    code: str
    new_password: str

def new_user_payload_to_mongo_schema(payload: NewUserPayload):
    newList = []
    newList.append(ListsMongoSchema(name="Favourites", recipes=[], date=None).dict())
    return UserMongoSchema(
        user_name=payload.user_name,
        email=payload.email,
        my_lists=newList,
        my_calendar=[],
        hashed_password=payload.password,
    )

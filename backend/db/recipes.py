from typing import Dict, List, Union
from pydantic import BaseModel, Field

# Post request body sent from frontend
class RecipePayload(BaseModel):
    # user_id: str
    user_name: str
    name: str
    ingredients: List[str]
    ingredients_index: Union[List[str], None]
    method: List[str]
    servings: int = None
    time: str = None
    diet: List[str] = None
    meal_type: str = None
    image: str = None

class RecipeSchema_Review(BaseModel):
    user_name: str
    comment: str
    rating: float = None


class RecipeSchema(BaseModel):
    _id: Union[str, None] = Field(..., alias="_id")
    # id: int = Config.fields(..., alias='_id')
    author: str
    title: str
    ingredients: List[str]
    ingredients_index: Union[List[str], None]
    instructions: Union[List[str], None]
    servings: Union[str, None]
    time: Union[str, None]
    dietary_requirements: List[str] = None
    meal_type: Union[str, None]
    image: Union[Dict[str, str], None]
    rating: int = None,
    has_ratings: bool = False #always false at the start
    has_time: bool
    time_int: int 
    servings_int: int

class RatingSchema(BaseModel):
    username: str
    rating: int


def recipe_payload_to_mongo_schema(payload: RecipePayload):
    time_bool = False
    temp = None
    temp1 = None
    if payload.time != None:
        time_bool = True
        s = payload.time.split()
        temp = int(s[0])
    if payload.servings != None:
        temp1 = int(payload.servings)
    
    return RecipeSchema(
        author=payload.user_name,
        title=payload.name,
        ingredients=payload.ingredients,
        ingredients_index=payload.ingredients_index,
        instructions=payload.method,
        servings=payload.servings,
        time=payload.time,
        dietary_requirements=payload.diet,
        meal_type=payload.meal_type,
        image={"base64": payload.image},
        has_ratings=False,
        has_time=time_bool,
        time_int=temp,
        servings_int=temp
    )


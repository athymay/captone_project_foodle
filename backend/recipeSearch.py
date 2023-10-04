from pymongo import MongoClient
import re
from bson.objectid import ObjectId
from json import dumps
from pydantic import BaseModel
from typing import List

client = MongoClient(
    "mongodb+srv://mif:VmkdZIBpqco1MPQ4@cluster0.htxrp.mongodb.net/?retryWrites=true&w=majority"
)
recipes_db = client.foodle.recipes

class RecipeSearchPayload(BaseModel):
    keywords: List[str]

def recipe_search(keywords_list):
    recipe_matches = {}
    for word in keywords_list:
        result = recipes_db.find({'$or': [{'author': re.compile(word, re.IGNORECASE)}, {'title': re.compile(word, re.IGNORECASE)}, {"ingredients": re.compile(word, re.IGNORECASE)}]}, {'_id': 1})
        for recipe in result:
                newRecipe = str(recipe['_id'])
                if newRecipe in recipe_matches.keys():
                    recipe_matches[newRecipe] +=1
                else:
                    recipe_matches[newRecipe] = 1
    id_matches = list(dict(sorted(recipe_matches.items(), key=lambda item: item[1], reverse=True)))
    recipes_list = []
    for id in id_matches:
            r = recipes_db.find_one({"_id": ObjectId(id)}, {'_id': 0})
            r['_id'] = id
            recipes_list.append(r)

    return dumps(recipes_list)
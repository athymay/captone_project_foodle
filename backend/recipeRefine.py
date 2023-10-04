from pymongo import MongoClient
from bson.objectid import ObjectId
import re

headers = {'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"}

client = MongoClient(
     "mongodb+srv://mif:VmkdZIBpqco1MPQ4@cluster0.htxrp.mongodb.net/?retryWrites=true&w=majority"
)
recipes_db = client.foodle.recipes

'''
This code is used to refine the recipes in the database to make them easier to filter through.xs
'''

for recipe in recipes_db.find({}):
    time = recipe['time']
    servings = recipe['servings']
    rating = recipe['rating']
    if servings is not None:
        if servings.isdigit():
            recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'servings_int': int(servings)}})
        else:
            temp = re.findall("\d+", servings)
            if len(temp) != 0:
                recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'servings_int': int(min(temp))}})
            else:
                recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'servings_int': None}})
    else:
        recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'servings_int': None}})
    if time is not None:
        temp = time.split()
        time_mins = 0
        if temp[1] in "minutes":
            num = re.findall("\d+", time)
            time_mins = int(max(num))
        elif temp[1] in "hours" and '-' not in time:
            time_mins = int(temp[0]) * 60
            if len(temp) >= 4 and temp[3] in "minutes":
                time_mins += int(temp[2])
        else:
            num = re.findall("\d+", time)
            time_mins = int(max(num)) * 60
        recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'time_int': time_mins}})
        recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'has_time': True}})
    else:
        recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'time_int': None}})
        recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'has_time': False}})
    if rating is None:
        recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'has_ratings': False}})
    else:
        recipes_db.update_one({"_id": ObjectId(recipe['_id'])}, {'$set': {'has_ratings': True}}) 

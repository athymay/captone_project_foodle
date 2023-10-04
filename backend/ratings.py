from statistics import mean
from pymongo import MongoClient
from bson.objectid import ObjectId

from db.recipes import RatingSchema

client = MongoClient(
   "mongodb+srv://mif:VmkdZIBpqco1MPQ4@cluster0.htxrp.mongodb.net/?retryWrites=true&w=majority"
)
recipes_db = client.foodle.recipes

def cal_taste_rating(id):
    taste_rating = recipes_db.find_one({"_id": ObjectId(id)}, {"taste_ratings": 1, "_id": 0})
    ratings = []
    for x in taste_rating['taste_ratings']:
        ratings.append(x['rating'])
    if len(ratings) == 0:
        recipes_db.update_one({"_id": ObjectId(id)}, {'$set': {'has_ratings': False}})
        return None
    recipes_db.update_one({"_id": ObjectId(id)}, {'$set': {'has_ratings': True}})
    return mean(ratings)

def cal_time_rating(id):
    time_rating = recipes_db.find_one({"_id": ObjectId(id)}, {"time_ratings": 1, "_id": 0})
    ratings = []
    for x in time_rating['time_ratings']:
        ratings.append(x['rating'])

def cal_diff_rating(id):
    diff_rating = recipes_db.find_one({"_id": ObjectId(id)}, {"diff_ratings": 1, "_id": 0})
    ratings = []
    for x in diff_rating['diff_ratings']:
        ratings.append(x['rating'])

def change_taste_rating(id, username, rating):
    user_rating = RatingSchema(username=username, rating=rating).dict()
    del_taste_rating(id, username)
    recipes_db.update_one({"_id": ObjectId(id)}, {'$addToSet': {'taste_ratings': user_rating}}, upsert=True)

def del_taste_rating(id, username):
    recipes_db.update_one({"_id": ObjectId(id)}, {'$pull': {'taste_ratings': {'username': username}}})

def change_time_rating(id, username, rating):
    user_rating = RatingSchema(username=username, rating=rating).dict()
    del_time_rating(id, username)
    recipes_db.update_one({"_id": ObjectId(id)}, {'$addToSet': {'time_ratings': user_rating}}, upsert=True)

def del_time_rating(id, username):
    recipes_db.update_one({"_id": ObjectId(id)}, {'$pull': {'time_ratings': {'username': username}}})

def change_diff_rating(id, username, rating):
    user_rating = RatingSchema(username=username, rating=rating).dict()
    del_diff_rating(id, username)
    recipes_db.update_one({"_id": ObjectId(id)}, {'$addToSet': {'diff_ratings': user_rating}}, upsert=True)

def del_diff_rating(id, username):
    recipes_db.update_one({"_id": ObjectId(id)}, {'$pull': {'diff_ratings': {'username': username}}})

def get_time_rating(id):
    return recipes_db.find_one({"_id": ObjectId(id) }, {"_id": 0, 'time_ratings': 1})

def get_taste_rating(id):
    return recipes_db.find_one({"_id": ObjectId(id)}, {"_id": 0, 'taste_ratings': 1})

def get_diff_rating(id):
    return recipes_db.find_one({"_id": ObjectId(id)}, {"_id": 0, 'diff_ratings': 1})
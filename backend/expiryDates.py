from pymongo import MongoClient
from datetime import datetime, date, timedelta

from db.users import NotificationMongoSchema

client = MongoClient(
    "mongodb+srv://mif:VmkdZIBpqco1MPQ4@cluster0.htxrp.mongodb.net/?retryWrites=true&w=majority"
)
users_db = client.foodle.users

def create_notif(username, ingredient, date):
    message = 'Your ingredient ' + ingredient + ' will expire in soon! You will have until the ' + date + ' to use it.'
    notif = NotificationMongoSchema (
        ingredient=ingredient,
        expiry_date=date,
        message=message
    ).dict()
    users_db.update_one({"user_name": username}, {'$addToSet': {'my_notifications': notif}})

def get_notif(username):
    user = users_db.find_one({"user_name": username}, {'my_notifications': 1, "_id": 0})
    return user['my_notifications']

def notif_count(username):
    user = users_db.find_one({"user_name": username}, {"my_notifications": 1, "_id": 0})
    return len(user['my_notifications'])

def change_expiry_date(username, ingredient, exdate):
     user = users_db.update_one({"user_name": username, "my_ingredients.name": ingredient}, {'$set': {"my_ingredients.$.expiry_date": exdate}})
     date_obj = datetime.strptime(exdate, '%d/%m/%y').date()
     if users_db.count_documents({'user_name': username, "my_notifications.ingredient": ingredient}) == 1:
         users_db.update_one({'user_name': username}, {'$pull': {'my_notifications': {"ingredient": ingredient}}})
         user = users_db.update_one({"user_name": username, "my_ingredients.name": ingredient}, {'$set': {"my_ingredients.$.notif": False}})
     if date_obj + timedelta(days=3) >= date.today():
         user = users_db.update_one({"user_name": username, "my_ingredients.name": ingredient}, {'$set': {"my_ingredients.$.notif": True}})
         create_notif(username, ingredient, exdate)

def add_expiry_date(username, ingredient, exdate):
     user = users_db.update_one({"user_name": username, "my_ingredients.name": ingredient}, {'$set': {"my_ingredients.$.expiry_date": exdate}})
     date_obj = datetime.strptime(exdate, '%d/%m/%y').date()
     if date_obj + timedelta(days=3) >= date.today():
         user = users_db.update_one({"user_name": username, "my_ingredients.name": ingredient}, {'$set': {"my_ingredients.$.notif": True}})
         create_notif(username, ingredient, exdate)

def del_expiry_date(username, ingredient):
     user = users_db.update_one({"user_name": username, "my_ingredients.name": ingredient}, {'$set': {"my_ingredients.$.expiry_date": None, "my_ingredients.$.notif": False}})
     if users_db.count_documents({'user_name': username, "my_notifications.ingredient": ingredient}) == 1:
         users_db.update_one({'user_name': username}, {'$pull': {'my_notifications': {"ingredient": ingredient}}})

def get_expiry_date(username, ingredient):
    return users_db.find_one({"user_name": username, "my_ingredients.name": ingredient}, {"my_ingredients.expiry_date": 1, "_id": 0})

def auto_create_notif():
    for doc in users_db.find({}):
        ing_list = doc['my_ingredients']
        for ing in ing_list:
            if ing['expiry_date'] != None:
                date_obj = datetime.strptime(ing['expiry_date'], '%d/%m/%y').date()
                if date_obj + timedelta(days=3) >= date.today() and ing['notif'] is False:
                    create_notif(doc['user_name'], ing['name'], ing['expiry_date'])
                    users_db.update_one({"user_name": doc['user_name'], "my_ingredients.name": ing['name']}, {'$set': {"my_ingredients.$.notif": True}})

def auto_delete_notif():
    for doc in users_db.find({}):
        notif_list = doc['my_notifications']
        for notif in notif_list:
            date_obj = datetime.strptime(notif['expiry_date'], '%d/%m/%y').date()
            if date_obj < date.today():
                users_db.update_one({'user_name': doc['user_name']}, {'$pull': {'my_notifications': {"ingredient": notif['ingredient']}}})
                # Take expiry date off ing since it is expired and set notif to False
                users_db.update_one({"user_name": doc['user_name'], "my_ingredients.name": notif['ingredient']}, {'$set': {"my_ingredients.$.notif": False, "my_ingredients.$.expiry_date": None}})

def auto_check_notifs():
    auto_create_notif()
    auto_delete_notif()
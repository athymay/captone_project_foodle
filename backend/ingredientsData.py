from ingredients import (
    addIngredient,
    addCategory,
    removeIngredient,
)

import random
from bs4 import BeautifulSoup as bs
import requests

userAgentList = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
]

for item in userAgentList:
    ua = random.choice(userAgentList)
    headers = {'User-Agent': ua}

def populateIngList():
    addCategory("condiments and seasonings")
    addCategory("vegetables and legumes")
    addCategory("fruits")
    addCategory("meats")
    addCategory("dairy")
    addCategory("breads")
    addCategory("herbs")
    addCategory("seafood")
    addCategory("grains")

    #Add condiments
    addIngredient("salt", "condiments and seasonings")
    addIngredient("sugar", "condiments and seasonings")
    populateCategory("condiments and seasonings", "h4", "https://www.homestratosphere.com/types-of-condiments/")
    
    #Add herbs
    populateCategory("herbs", "h3", "https://www.homestratosphere.com/types-of-herbs/")

    # Add vegetables and legumes
    r = requests.get("https://simple.wikipedia.org/wiki/List_of_vegetables", headers=headers)
    soup = bs(r.content, "html5lib")
  
    for tag in soup.find_all():
        try:
            doNotAdd = ["change this page", "Wikipedia (en)", "Fruit", "Vegetable", "Food", "New Zealand spinach", "Legumes", "Herbs"]
            ingredient = ''
            if tag['title'] == "Watercress":
                ingredient = "Watercress"
                break
            elif " (not yet started)" in tag['title']:
                ingredient = tag['title'].replace("(not yet started)", "")
            elif " (vegetable)" in tag["title"]:
                ingredient = tag['title'].replace(" (vegetable)", "")
            elif tag['title'] not in doNotAdd:
                ingredient = tag['title']
            if ingredient:
                addIngredient(ingredient, "Vegetables and Legumes")
        except KeyError:
            pass

    addIngredient("turnips", "vegetables and legumes")
    addIngredient("spinach", "vegetables and legumes")
    
    #Add Fruits
    populateCategory("fruits", "h3", "https://www.homestratosphere.com/types-of-fruit-tree/")
    removeIngredient("Pome Fruits", "Fruits")
    removeIngredient("Stone Fruits or Drupes", "Fruits")
    removeIngredient("Source: owlcation", "Fruits")
    #Add bread
    populateCategory("Breads", "h3", "https://www.homestratosphere.com/types-of-bread/")
    removeIngredient("Kn\u00e4ckebr\u00f6d Bread", "Breads")

    populateCategory("seafood", "h4", "https://discoverseafood.uk/seafood/")

    populateCategory("grains", "h3", "https://www.homestratosphere.com/types-of-grains/")

    addIngredient("chicken", "meats")
    addIngredient("turkey", "meats")
    addIngredient("duck", "meats")
    addIngredient("goose", "meats")
    addIngredient("beef", "meats")
    addIngredient("pork", "meats")
    addIngredient("mutton", "meats")
    addIngredient("lamb", "meats")
    addIngredient("rabbit", "meats")
    addIngredient("steak", "meats")
    addIngredient("game", "meats")
    addIngredient("venison", "meats")
    addIngredient("bacon", "meats")
    addIngredient("ham", "meats")
    addIngredient("chorizo", "meats")
    addIngredient("pepperoni", "meats")
    addIngredient("salami", "meats")
    addIngredient("goat", "meats")


    #Add dairy
    addIngredient("milk", "dairy")
    addIngredient("cream", "dairy")
    addIngredient("butter", "dairy")
    addIngredient("ice cream", "dairy")
    addIngredient("yoghurt", "dairy")
    populateCategory("dairy", "h2", "https://www.usdairy.com/news-articles/cheese-types-what-you-need-to-know-about-cheese")
    
def populateCategory(category, element, url):
    r = requests.get(url, headers=headers)
    soup = bs(r.content, "html.parser")
    for heading in soup.find_all(element):
        ingredient = heading.text.strip()
        if category == "condiments and seasonings":
            doNotAdd = ["Salt (a mineral)", "Sugar (a sweetener)","Blue cheese", "Ricotta cheese", "Feta cheese", "Parmesan cheese"]
            if ingredient in doNotAdd:
                ingredient = ""
        if category == "dairy":
            if "Cheese" not in ingredient and "Curds" not in ingredient and "cheese" not in ingredient:
                ingredient += " cheese"
        if category == "meats":
            doNotAdd = ["Red Meat vs. White Meat", "Types of Meat (With Pictures)", "#1 Type of Meat: White Meat", "#2 Type of Meat: Red Meat"]
            if ingredient in doNotAdd:
                ingredient = ""
        if "?" not in ingredient and ingredient:
            addIngredient(ingredient, category)
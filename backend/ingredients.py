ingredientsList = {}

def getIngredientsList():
    ingInfo = []
    for cat in ingredientsList.items():
        ingInfo.append(
            {
                "categoryName": cat[0], 
                "ingredients": []
            }
        )
        for ing in cat[1]:
            ingInfo[-1]["ingredients"].append(ing["name"])
    return {"categories": ingInfo}

def getIngredient(ingredient):
    ingredient = ingredient.lower()
    for cat in ingredientsList.items():
        for ing in cat[1]:
            if ing["name"] == ingredient:
                return ing

def updatePopularity(ingredient):
    ingredient = ingredient.lower()
    ing = getIngredient(ingredient)
    if ing is None:
        return "Ingredient does not exist"
    ing["popularity"] += 1
    ingredientsList[ing["category"]].sort(key=lambda ing: ing["popularity"], reverse = True)

def ingExists(ingredient):
    ingredinet = ingredient.lower()
    for cat in ingredientsList.items():
        for item in cat[1]:
            if item["name"] == ingredient:
                return True 

def addIngredient(ingredient, category):
    ingredient = ingredient.lower()
    category = category.lower()
    if category not in ingredientsList:
        ingredientsList[category.lower()] = []
    if ingExists(ingredient):
        return "ingredient exists"
    ingredientsList[category].append({"name": ingredient, "category": category, "popularity": 0})

def addCategory(category):
    if category not in ingredientsList:
        ingredientsList[category.lower()] = []
    else:
        return "category exists"

def removeIngredient(ingredient, category):
    ingredient = ingredient.lower()
    category = category.lower()
    for item in ingredientsList[category]:
        if item["name"] == ingredient:
            ingredientsList[category].remove(item)

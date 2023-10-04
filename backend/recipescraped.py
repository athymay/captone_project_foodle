import requests
from bs4 import BeautifulSoup as bs
import json
import re
import pandas as pd
from db.recipes import RecipeSchema
from pymongo import MongoClient

headers = {'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"}

client = MongoClient(
   "mongodb+srv://mif:VmkdZIBpqco1MPQ4@cluster0.htxrp.mongodb.net/?retryWrites=true&w=majority"
)
recipes_db = client.foodle.recipes


class recipeData():
    def __init__(self, url):
        self.url = url 
        self.soup = bs(requests.get(url, headers=headers).content, 'html.parser')
    
    def title(self):
        try:
            return self.soup.find('h1').text.strip()
        except:
            return None
    
    def author(self):
        return 'Jamie Oliver'
    
    def servings(self):
        try:
            return self.soup.find('div', {'class': 'recipe-detail serves'}).text.split(' ',1)[1]
        except:
            return None

    def time(self):
        try:
            return self.soup.find('div', {'class': 'recipe-detail time'}).text.split('In')[1]
        except:
            return None
    
    def image(self):
        try:
            return self.soup.find('img').attrs['src']
        except:
            return None
    
    def mealType(self):
        try:
            data = json.loads(self.soup.find('script', type='application/ld+json').text)
            return data['recipeCategory']
        except:
            return None
    
    def dietReq(self):
        try:
            reqs = ['dairy-free', 'vegan', 'vegetarian', 'gluten-free']
            data = json.loads(self.soup.find('script', type='application/ld+json').text)
            dietReqs =[]
            l = data['keywords'].split(', ')
            for x in l:
                if x in reqs:
                    dietReqs.append(x)
            return dietReqs
        except:
            return None

    def ingredients(self):
        try:
            ingredients = [] 
            for x in self.soup.select('.ingred-list li'):
                ing = ' '.join(x.text.split())
                ingredients.append(ing)
            return ingredients
        except:
            return None
    
    def instructions(self):
        try:
            data = self.soup.find('ol', {'class': 'recipeSteps'}).prettify().strip('<ol class="recipeSteps">\n<li>').split('</li>')
            data_final = []
            for x in data:
                temp = x.strip('\n<li> ')
                if re.search('[a-zA-Z]', temp):
                    data_final.append(temp)
            return data_final
        except:
            return None


recipeURLS = []
categories = ["https://www.jamieoliver.com/recipes/category/course/mains/", "https://www.jamieoliver.com/recipes/category/course/snacks/", "https://www.jamieoliver.com/recipes/category/course/desserts/", "https://www.jamieoliver.com/recipes/category/course/starters/"]

for i in categories:
    res = requests.get(i)
    soup = bs(res.text, "html.parser")
    urls = pd.Series(['https://www.jamieoliver.com' + a.get("href") for a in soup.find_all("a")])
    urls = urls[(urls.str.contains("/recipes/")==True) & (urls.str.contains("-recipes/")==True)& (urls.str.contains("course")==False)&(urls.str.endswith("recipes/")==False)].unique()
    recipeURLS.extend(list(urls))
    
for url in recipeURLS:
    recipeDetails = recipeData(url)

    newRecipe = RecipeSchema(
        _id=None,
        author=recipeDetails.author(),
        title=recipeDetails.title(),
        ingredients=recipeDetails.ingredients(),
        instructions=recipeDetails.instructions(),
        servings=recipeDetails.servings(),
        time=recipeDetails.time(),
        dietary_requirements=recipeDetails.dietReq(),
        meal_type=recipeDetails.mealType(),
        image={
					"url": recipeDetails.image()
		},
    )

    recipes_db.insert_one(newRecipe.dict())
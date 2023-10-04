import React from 'react';
import './list.css';
import RecipeCard from '../homepage/RecipeCard';

export default function ListRecipe(props) {
  const { recipeID, listName } = props;
  const [recipe, setRecipe] = React.useState(null);

  const fetchRecipe = React.useCallback(async () => {
    const response = await fetch(`/api/recipe/${recipeID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    var res = await response.json();
    const setID = {"$oid": recipeID}
    res["_id"] = setID;
    setRecipe(res);
  }, [recipeID]);

  React.useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  return (
    <>
      {recipe == null ? null : (
        <RecipeCard
          key={recipeID}
          id={recipe['_id']['$oid']}
          recipe={recipe}
          variant={1}
          listName={listName}
        />
      )}
    </>
  );
}

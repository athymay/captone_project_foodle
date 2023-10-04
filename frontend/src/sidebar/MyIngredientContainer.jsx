import "./components.css";
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

const MyIngredientContainer = (props) => {
  const { ingredient, category } = props;
  const { token, setPantry } = useContext(AppContext);
  const formattedIngredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1)

  const delIngredients = React.useCallback(async () => {
    const req = JSON.stringify({ ingredient: ingredient, category: category });
    await fetch(`/api/user/myingredients/remove`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req,
    });

    const element = document.getElementById(ingredient);
    element.remove();
  }, [category, ingredient, token]);

  function handleIngredientClick() {
    delIngredients();
    fetchMyPantry();
  }

  const fetchMyPantry = React.useCallback(async () => {
    const response = await fetch(`/api/user/myingredients`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const ingredients = await response.json();
    var dict = JSON.parse(ingredients);
    var array = dict.categories;
    setPantry(array);
  }, [setPantry, token]);

  return (
    <div>
      <button
        id={ingredient}
        className="ingredient-item"
        onClick={handleIngredientClick}
      >
        <div>{formattedIngredient}</div>
      </button>
    </div>
  );
};
export default MyIngredientContainer;

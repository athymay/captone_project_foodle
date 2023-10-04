import './components.css';
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { StoreContext } from '../Store.jsx';

const IngredientContainer = (props) => {
  const { ingredient, category } = props;
  const { token, fetchMyPantry } = useContext(AppContext);
  const context = React.useContext(StoreContext);
  const selectedIngredients = context.selectedIngredients;
  const formattedIngredient =
    ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

  const setIngredients = React.useCallback(async () => {
    const req = JSON.stringify({ ingredient: ingredient, category: category });
    const response = await fetch(`/api/user/myingredients/add`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req,
    });
    await response.json();
    await fetchMyPantry();
  }, [category, fetchMyPantry, ingredient, token]);

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
    await fetchMyPantry();
  }, [category, fetchMyPantry, ingredient, token]);

  function handleIngredientClick() {
    setIngredients();
    if (!selectedIngredients.includes(ingredient)) {
      context.setSelectedIngredients([...selectedIngredients, ingredient]);
    } else {
      delIngredients();
      context.setSelectedIngredients((current) =>
        current.filter((e) => {
          return e !== ingredient;
        })
      );
    }
  }


  return (
    <button id={formattedIngredient} className={`ingredient-item ${selectedIngredients.includes(ingredient) ? 'selected-ingredient' : null}`} onClick={handleIngredientClick}>
      <div>{formattedIngredient}</div>
    </button>
  );
};
export default IngredientContainer;

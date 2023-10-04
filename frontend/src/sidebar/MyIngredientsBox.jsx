import "./components.css";
import React from "react";
import MyIngredientContainer from "./MyIngredientContainer";


const IngredientBox = (props) => {
  const { name, ingredients } = props;

  return (
    <div>
      <div className="ingredient-heading"> {name}</div>
      {ingredients.map((val) => {
        return (
          <div key={val}>
            <MyIngredientContainer
              ingredient={val}
              category={name}
            />
          </div>
        );
      })}
      <br/>
    </div>
  );
};
export default IngredientBox;
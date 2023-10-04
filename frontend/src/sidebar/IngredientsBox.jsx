import "./components.css";
import IngredientContainer from "./IngredientContainer";


const IngredientBox = (props) => {
  const { ingredients } = props;
  const ingredientCategory = ingredients.categoryName.charAt(0).toUpperCase() + ingredients.categoryName.slice(1)

  return (
    <div>
      <div className="ingredient-heading"> {ingredientCategory}</div>
      {ingredients.ingredients.map((val) => {
        return (
          <div key={val}>
            <IngredientContainer
              ingredient={val}
              category={ingredients.categoryName}
            />
          </div>
        );
      })}
      <br/>
    </div>
  );
};
export default IngredientBox;

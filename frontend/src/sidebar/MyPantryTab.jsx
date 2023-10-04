import '../App.css';
import React, { useContext } from 'react';
import MyIngredientBox from './MyIngredientsBox.jsx';
import PromptLogin from '../pages/auth/PromptLogin';

import { AppContext } from '../AppContext';

function MyPantry() {
  const { token, CategoryIngredients, pantry } = useContext(AppContext);
  const [myPantry, setMyPantry] = React.useState({});

  React.useEffect(() => {
    var newPantry = {};
    pantry.forEach((val) => {
      newPantry[val.categoryName] = val.ingredients;
    });
    setMyPantry(newPantry);
  }, [pantry]);

  const categories = React.useMemo(() => {
    var array = CategoryIngredients;
    var cats = [];
    array.forEach((item) => {
      cats.push(item.categoryName);
    });
    return cats;
  }, [CategoryIngredients]);

  return (
    <div className="side-drawer">
      <div className="heading_box">
        <div className="heading">My Pantry</div>
      </div>
      <hr />
      {token == null ? (
        <PromptLogin />
      ) : (
        <div className="ingredients-box">
          {categories.map((val, idx) => {
            if (myPantry[val]) {
              return (
                <div key={idx}>
                  <MyIngredientBox
                    name={val}
                    ingredients={myPantry[val]}
                  />
                  <hr />
                </div>
              );
              } else {
                return (
                  <div key={idx}>
                    <MyIngredientBox
                      name={val}
                      ingredients={[]}
                    ></MyIngredientBox>
                    <hr />
                  </div>
                );
              }
          })}
        </div>
      )}
    </div>
  );
}

export default MyPantry;

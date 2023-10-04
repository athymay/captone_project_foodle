import React from 'react';
import './list.css';
import { AppContext } from '../../AppContext';
import ListRecipe from './ListRecipe';

export default function Lists() {
  const { myLists } = React.useContext(AppContext);

  const queryParams = new URLSearchParams(window.location.search);
  const listName = queryParams.get('listID');

  return (
    <div className="lists-Page">
        <div className="listinfo-Container">
          <h2>{listName}</h2>
          <div className="RecipiesContainer">
          {myLists[listName]
          ? myLists[listName].map((val, idx) => {
            return (
              <ListRecipe key={idx} recipeID={val} listName={listName} />
            )
          })
          : <div></div>
          }
          </div>
        </div>
    </div>
  );
}
import "../App.css";
import React, { useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../Store.jsx';
import SmallRecipeCard from "./SmallRecipeCard";
import { AppContext } from '../AppContext';
import PromptLogin from "../pages/auth/PromptLogin";

export default function Calendar() {
  const context = React.useContext(StoreContext);
  const date = context.selectedDate;
  const { token } = useContext(AppContext);
  const [breakfastRecipes, setBreakfastRecipes] = React.useState([]);
  const [lunchRecipes, setLunchRecipes] = React.useState([]);
  const [dinnerRecipes, setDinnerRecipes] = React.useState([]);
  const [update, setUpdate] = React.useState(false);

  const fetchRecipes = React.useCallback(async () => {
    setUpdate(false);
    setBreakfastRecipes([]);
    setLunchRecipes([]);
    setDinnerRecipes([]);
    getListsOnDate(token, date).then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i]['meal'] === 'Breakfast') {
          getRecipes(data[i]['recipes']).then((data) => {
            setBreakfastRecipes(data);
          });
        } else if (data[i]['meal'] === 'Lunch') {
          getRecipes(data[i]['recipes']).then((data) => {
            setLunchRecipes(data);
          });
        } else if (data[i]['meal'] === 'Dinner') {
          getRecipes(data[i]['recipes']).then((data) => {
            setDinnerRecipes(data);
          });
        }
      }
    });
  }, [date, token]);

  React.useEffect(() => {
    if (token) {
      fetchRecipes();
    }
  }, [fetchRecipes, date, token]);

  React.useEffect(() => {
    if (update) {
      fetchRecipes();
    }
  }, [fetchRecipes, update]);

  return (
    <div className="side-drawer" id="calendar-sidebar">
      <div className="heading_box">
        <div className="heading">My Calendar</div>
      </div>
      {token ? <div id="selected-date-tab">{dateFormatter(date)}</div> : null}
      {token ? (
        <div id="calendar-box">
          <div className="meal-type-group" style={{ paddingTop: '10px' }}>
            <div className="meal-type-label">Breakfast</div>
            {breakfastRecipes.length > 0 ? (
              breakfastRecipes.map((val, idx) => {
                return (
                  <SmallRecipeCard
                    key={idx}
                    index={idx}
                    recipes={breakfastRecipes}
                    date={date}
                    meal={'Breakfast'}
                    setUpdate={setUpdate}
                  />
                );
              })
            ) : (
              <div className="no-recipes-added">No recipes added</div>
            )}
          </div>
          <div className="meal-type-group">
            <div className="meal-type-label">Lunch</div>
            {lunchRecipes.length > 0 ? (
              lunchRecipes.map((val, idx) => {
                return (
                  <SmallRecipeCard
                    key={idx}
                    index={idx}
                    recipes={lunchRecipes}
                    date={date}
                    meal={'Lunch'}
                    setUpdate={setUpdate}
                  />
                );
              })
            ) : (
              <div className="no-recipes-added">No recipes added</div>
            )}
          </div>
          <div className="meal-type-group">
            <div className="meal-type-label">Dinner</div>
            {dinnerRecipes.length > 0 ? (
              dinnerRecipes.map((val, idx) => {
                return (
                  <SmallRecipeCard
                    key={idx}
                    index={idx}
                    recipes={dinnerRecipes}
                    date={date}
                    meal={'Dinner'}
                    setDinnerRecipes={setDinnerRecipes}
                    setUpdate={setUpdate}
                  />
                );
              })
            ) : (
              <div className="no-recipes-added">No recipes added</div>
            )}
          </div>
        </div>
      ) : (
        <PromptLogin />
      )}
    </div>
  );
}

function dateFormatter(date) {
  const newDate = new Date(date);
  const day = newDate.getDate().toString().replace(/^0+/, '');
  const month = newDate.toLocaleString('default', { month: 'long' });
  const year = newDate.getFullYear();

  const weekday = newDate.toLocaleString('en-us', { weekday: 'long' });

  return `${weekday} ${day} ${month} ${year}`;
}

async function getListsOnDate(token, date) {
  const response = await fetch(`/api/user/myCalendar?date=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await response.json();

  let list = [];

  if (res.length > 0) {
    list = JSON.parse(res);
    list = list['my_calendar'];
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(list);
    }, 50);
  });
}

async function getRecipes(recipeList) {
  let newList = [];
  for (let i = 0; i < recipeList.length; i++) {
    const recipeInfo = await getRecipeFromId(recipeList[i]);
    recipeInfo['_id'] = {
      $oid: recipeList[i],
    };
    newList.push(recipeInfo);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newList);
    }, 50);
  });
}

async function getRecipeFromId(recipeId) {
  let recipe = {};
  await axios
    .get(`/api/recipe/${recipeId}`)
    .then((response) => {
      if (response.status === 200) {
        recipe = response.data;
      }
    })
    .catch((err) => {
      if (err.response.status === 400) {
        console.error(err.response.data);
      } else if (err.response.status === 404) {
        console.error(err.response.data);
      }
    });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recipe);
    }, 50);
  });
}

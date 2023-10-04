import '../App.css';
import './components.css';
import { AppContext } from '../AppContext';
import React from 'react';
import IngredientBox from './IngredientsBox';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

function Ingredients() {
  const { CategoryIngredients } = React.useContext(AppContext);

  const [ingredientSearchText, setIngredientSearchText] = React.useState('');
  const [allIng, setAllIng] = React.useState(['']);

  React.useEffect(() => {
    var array = CategoryIngredients;

    var entireList = [];
    array.forEach((element) => {
      entireList = [...entireList, ...element.ingredients];
    });
    let formattedList = []

    for (let i = 0; i < entireList.length; i++) {
      const formatted = entireList[i].charAt(0).toUpperCase() + entireList[i].slice(1)
      formattedList.push(formatted)
    }

    setAllIng(formattedList);
  }, [CategoryIngredients]);

  function searchIngredient() {
    const element = document.getElementById(ingredientSearchText);
    element.scrollIntoView({ behavior: 'smooth' });
  }

  function handleIngredientClick(e, it) {
    setIngredientSearchText(it);
  }

  return (
    <div className="side-drawer">
      <div className="heading_box">
        <div className="heading">Ingredients</div>
        <br/>
        <div className="search-bar-group">
          <Autocomplete
            style={{width: '100%', }}
            freeSolo
            options={allIng}
            onChange={handleIngredientClick}
            PaperComponent={({ children }) => (
              <Paper style={{ fontFamily: "'Outfit', sans-serif", color: '#484848'}}>{children}</Paper>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for an ingredient"
                sx={{
                  ".MuiOutlinedInput-input": {
                    fontFamily: "'Outfit', sans-serif",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: 'none'
                  },
                }}
              />
            )}
          />
          <div className="search-button" onClick={searchIngredient}>
            <SearchIcon id="search-icon" />
          </div>
        </div>
      </div>
      <div className="ingredients-box">
        {CategoryIngredients.map((val) => {
          return (
            <div key={val.categoryName}>
              <IngredientBox ingredients={val} />
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Ingredients;

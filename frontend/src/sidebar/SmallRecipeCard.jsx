import React, { useState } from "react";
import axios from 'axios';
import "../App.css";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DatePickerModal from "../pages/homepage/DatePickerModal";
import { StoreContext } from '../Store.jsx';
import { AppContext } from '../AppContext';
import {
  useNavigate,
} from 'react-router-dom';

const style = {
  img: {
    height: '100px',
    maxWidth: '30%',
    display: 'flex',
  },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    color: '#484848',
    fontSize: '12pt',
    fontWeight: 'bold'
  },
  content: {
    display: 'flex',
    fontFamily: "'Outfit', sans-serif",
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    minWidth: '0',
    maxWidth: '70%'
  },
}

export default function SmallRecipeCard(props) {
  const { recipes, index, date, meal, setUpdate } = props;
  const [heartHover, setHeartHover] = useState(false);
  const [myFavourite, setMyFavourite] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const context = React.useContext(StoreContext);
  const { token,setMyLists, myLists } = React.useContext(AppContext);
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const navigate = useNavigate();

  const handleMoreButton = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget);
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    setAnchorEl(null)
    setOpenDatePicker(true)
  }

  const handleRemoveFromCalender = (e) => {
    e.stopPropagation()
    setAnchorEl(null);
    setUpdate(true)
    removeRecipe(token, meal, date, recipes[index])
  }

  const handleClose = (e) => {
    e.stopPropagation()
    setAnchorEl(null);
  };

  const handleFavouriteButton = (e) => {
    if (!myFavourite) {
      addtoFavourites();
    } else {
      removeFromFavourites();
    }
    setMyFavourite(!myFavourite);
    e.stopPropagation();
  };

  function openRecipeCard() {
    context.setRecipe(recipes[index])
    const id = recipes[index]["_id"]["$oid"]
    navigate(`/full-recipe/${id}`)
  }

  const fetchLists = React.useCallback(async () => {
    const response = await fetch(`/api/user/myLists`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    var lists = JSON.parse(res);
    var newLists = {};
    lists.forEach((val) => {
      newLists[val.name] = val.recipes;
    });
    setMyLists(newLists);
  }, [setMyLists, token]);

  const addtoFavourites = React.useCallback(async () => {
    const req = JSON.stringify({
      name: 'Favourites',
      recipes: [recipes[index]['_id']['$oid']],
    });
    const response = await fetch(`/api/user/mylists/createUpdateList`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req,
    });
    await response.json();
    fetchLists();
  }, [recipes[index]['_id']['$oid'], token]);

  const removeFromFavourites = React.useCallback(async () => {
    const req = JSON.stringify({
      name: 'Favourites',
      recipes: [recipes[index]['_id']['$oid']],
    });
    const response = await fetch(`/api/user/mylists/removeRecipesFromList`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req,
    });
    const res = await response.json();
    fetchLists();
  }, []);

  const checkFavourite = React.useCallback(async () => {   
    if (Object.keys(myLists).length !== 0) {
      if (myLists["Favourites"].includes(recipes[index]["_id"]["$oid"])) {
        setMyFavourite(true)
      }
    }
  }, []);

  React.useEffect(() => {
    checkFavourite();
  }, []);

  return (
    <Card
      className="small-recipes-card"
      onClick={openRecipeCard}
    >
      <CardActionArea style={style.card}>
        <CardMedia
          style={style.img}
          component="img"
          height="194"
          image={recipes[index]['image']['url']}
        />
        <CardContent style={style.content}>
          <div id="recipe-name-small">
            {recipes[index].title}
          </div>
          <div id="recipe-card-btn-group">
            <div
              id="favourite-btn"
              onMouseOver={() => setHeartHover(true)}
              onMouseLeave={() => setHeartHover(false)}
              onClick={handleFavouriteButton}
            >
              {heartHover || myFavourite ? <FavoriteIcon sx={{ color: '#3BB927' }}/> : <FavoriteBorderIcon />}
            </div>
            <div id="more-btn" onClick={handleMoreButton}>
              <MoreVertIcon/>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleEdit} sx={{fontFamily: "'Outfit', sans-serif", color: "#484848"}}>Edit</MenuItem>
        <MenuItem onClick={handleRemoveFromCalender} sx={{fontFamily: "'Outfit', sans-serif", color: "#484848"}}>Remove</MenuItem>
      </Menu>
      <DatePickerModal
        open={openDatePicker}
        setOpen={setOpenDatePicker}
        recipeInfo={recipes[index]}
        task={"edit"}
        date={new Date(date)}
        meal={meal}
        setUpdate={setUpdate}
      />
    </Card>
  );
}

async function removeRecipe(token, mealType, date, recipe) {
  const body = {
    "date": date,
    "meal": mealType,
    "recipes": [
      recipe["_id"]["$oid"]
    ]
  }

  await axios.put(`/api/user/myCalendar/removeRecipesFromMealPlan/`, body, {
    headers: {
    'Content-Type' : 'application/json',
    'Authorization': `Bearer ${token}`,
  }}).catch(err => {
    if (err.response.status === 400) {
      console.error(err.response.data)
    } else if (err.response.status === 403) {
      console.error(err.response.data)
    }
  });
}

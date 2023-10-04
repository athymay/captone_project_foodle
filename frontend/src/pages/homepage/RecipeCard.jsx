import React, { useState } from "react";
import "../../App.css";
import DatePickerModal from './DatePickerModal';
import ListPickerModal from './ListPickerModal';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { StoreContext } from '../../Store.jsx';
import { AppContext } from "../../AppContext.tsx";
import {
  useNavigate,
} from 'react-router-dom';

export default function RecipeCard(props) {
  const { recipe, variant, listName } = props;
  const [heartHover, setHeartHover] = useState(false);
  const [myFavourite, setMyFavourite] = React.useState(false);
  const context = React.useContext(StoreContext);
  const {token, setMyLists, myLists } =  React.useContext(AppContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [openListPicker, setOpenListPicker] = useState(false)

  const handleClose = (e) => {
    e.stopPropagation()
    setAnchorEl(null);
  };

  function openRecipeCard() {
    context.setRecipe(recipe)
    const id = recipe["_id"]["$oid"]
    navigate(`/full-recipe/${id}`);
  }

  const handleMoreButton = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget);
  }

  const handleAddToCalender = (e) => {
    e.stopPropagation()
    setAnchorEl(null);
    setOpenDatePicker(true)
  }

  const handleAddToList = (e) => {
    e.stopPropagation()
    setAnchorEl(null);
    setOpenListPicker(true)
  }

  const handleFavouriteButton = (e) => {
    if (!myFavourite) {
      addtoFavourites();
    } else {
      removeFromFavourites();
    }
    setMyFavourite(!myFavourite)
    e.stopPropagation()
  }

  const handleRemoveFromList = (e) => {
    e.stopPropagation()
    removeFromList();
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
      recipes: [recipe['_id']['$oid'].toString()],
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
    const res = await response.json();
    fetchLists();
  }, [fetchLists, recipe, token]);

  const removeFromList = React.useCallback(async () => {
    const req = JSON.stringify({
      name: listName,
      recipes: [recipe['_id']['$oid']],
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
    console.log(res);
    fetchLists();
  }, [fetchLists, listName, recipe, token]);

  const removeFromFavourites = React.useCallback(async () => {
    const req = JSON.stringify({
      name: 'Favourites',
      recipes: [recipe['_id']['$oid']],
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
      if (myLists["Favourites"].includes(recipe["_id"]["$oid"])) {
        setMyFavourite(true)
      }
    }
  }, []);

  React.useEffect(() => {
    if (token) {
      checkFavourite();
    }
  }, []);

  return (
    <Card
      className="recipes-card"
      style={{ color: '#525252' }}
      onClick={openRecipeCard}
      id={recipe["_id"]["$oid"]}
    >
      <CardActionArea>
        <CardMedia
          id="card-img"
          component="img"
          height="194"
          image={
            recipe['image'].hasOwnProperty('url')
            ? recipe['image']['url']
            : recipe['image']['base64']
          }
        />
        <CardContent id="card-content">
          <div id="card-content-left">
            <div id="recipe-name">{recipe['title']}</div>
            <div id="time-content">
              <AccessTimeIcon className="card-icon" />
              <div id="recipe-time">{recipe["time"] ? recipe["time"] : 'N/A'}</div>
            </div>
            <div id="rating-content">
              <StarIcon className="card-icon" />
              {recipe["rating"] ? recipe["rating"] : 'No ratings'}
            </div>
          </div>
          {token ?
          <div id="recipe-card-btn-group">
            <div
              id="favourite-btn"
              onMouseOver={() => setHeartHover(true)}
              onMouseLeave={() => setHeartHover(false)}
              onClick={handleFavouriteButton}
            >
              {(myFavourite || heartHover) ? <FavoriteIcon sx={{ color: '#3BB927' }}/> : <FavoriteBorderIcon />}
            </div>
            <div id="more-btn" onClick={handleMoreButton}>
              <MoreVertIcon/>
            </div>
          </div>
          : null }
        </CardContent>
      </CardActionArea>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleAddToList} sx={{fontFamily: "'Outfit', sans-serif", color: "#484848"}}>Add to List</MenuItem>
        <MenuItem onClick={handleAddToCalender} sx={{fontFamily: "'Outfit', sans-serif", color: "#484848"}}>Add to Calendar</MenuItem>
        {variant === 1
          ?
        <MenuItem onClick={handleRemoveFromList} sx={{fontFamily: "'Outfit', sans-serif", color: "#484848"}}>Remove From List</MenuItem>
        : null
        }
      </Menu>
      <DatePickerModal
        open={openDatePicker}
        setOpen={setOpenDatePicker}
        recipeInfo={recipe}
        task={"add"}
        date={new Date()}
        meal={"Breakfast"}
      />
      <ListPickerModal
        open={openListPicker}
        setOpen={setOpenListPicker}
        recipeID={recipe["_id"]["$oid"]}
      />
    </Card>
  );
}

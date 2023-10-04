import React from 'react';
import CardMedia from "@mui/material/CardMedia";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StoreContext } from '../Store.jsx';
import { AppContext } from '../AppContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DatePickerModal from './homepage/DatePickerModal';
import ListPickerModal from './homepage/ListPickerModal.jsx';

const style = {
  imgDiv: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    display: 'flex',
    width: '300px',
    height: '320px'
  },
  '@media (max-width: 900px) and (min-width: 0px)': {
    img: {
      width: '280px',
      height: '300px'
    },
  },
  recipeInfo: {
    display: 'flex',
    fontSize: '15pt',
    color: '#484848'
  },
  spacing: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  rightSpace: {
    paddingRight: '4px'
  },
  bottomContent: {
    marginTop: '20px'
  },
  time: {
    marginBottom: '8px'
  }
};

export default function RecipePage() {
  const [heartHover, setHeartHover] = React.useState(false);
  const [myFavourite, setMyFavourite] = React.useState(false);
  const context = React.useContext(StoreContext);
  const recipeId = context.recipe["_id"]["$oid"]
  const { username, token, setShowSidebarTabOptions, setMyLists, myLists } = React.useContext(AppContext);
  const [avgTasteRating, setAvgTasteRating] = React.useState('')
  const [avgDiffRating, setAvgDiffRating] = React.useState('')
  const [avgTimeRating, setAvgTimeRating] = React.useState('')
  const [myTasteRating, setMyTasteRating] = React.useState(0);
  const [starTasteHover, setStarTasteHover] = React.useState(0);
  const [myDifficultyRating, setMyDifficultyRating] = React.useState(0);
  const [starDifficultyHover, setStarDifficultyHover] = React.useState(0);
  const [myTimeRating, setMyTimeRating] = React.useState(0);
  const [starTimeHover, setStarTimeHover] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openDatePicker, setOpenDatePicker] = React.useState(false)
  const [tasteRatings, setTasteRatings] = React.useState([])
  const [diffRatings, setDiffRatings] = React.useState([])
  const [timeRatings, setTimeRatings] = React.useState([])
  const [openListPicker, setOpenListPicker] = React.useState(false)

  const fetchRatings = React.useCallback(async () => {
    const res1 = await getRating(recipeId, token, 'taste');
    if (Object.keys(res1).length !== 0) {
      setTasteRatings(res1['taste_ratings']);
    } else {
      setTasteRatings([]);
    }

    const res2 = await getRating(recipeId, token, 'diff');
    if (Object.keys(res2).length !== 0) {
      setDiffRatings(res2['diff_ratings']);
    } else {
      setDiffRatings([]);
    }
    const res3 = await getRating(recipeId, token, 'time');
    if (Object.keys(res3).length !== 0) {
      setTimeRatings(res3['time_ratings']);
    } else {
      setTimeRatings([]);
    }

    if (token) {
      if (res1['taste_ratings']) {
        const taste = res1['taste_ratings'].find(
          (item) => item['username'] === username
        );
        if (taste) {
          setMyTasteRating(parseInt(taste.rating));
        }
      }

      if (res2['diff_ratings']) {
        const difficulty = res2['diff_ratings'].find(
          (item) => item['username'] === username
        );
        if (difficulty) {
          setMyDifficultyRating(parseInt(difficulty.rating));
        }
      }

      if (res3['time_ratings']) {
        const time = res3['time_ratings'].find(
          (item) => item['username'] === username
        );
        if (time) {
          setMyTimeRating(parseInt(time.rating));
        }
      }
    }

    if (Object.keys(res1).length !== 0) {
      setAvgTasteRating(getAvgRating(res1['taste_ratings']));
    } else {
      setAvgTasteRating('');
    }

    if (Object.keys(res2).length !== 0) {
      setAvgDiffRating(getAvgRating(res2['diff_ratings']));
    } else {
      setAvgDiffRating('');
    }

    if (Object.keys(res3).length !== 0) {
      setAvgTimeRating(getAvgRating(res3['time_ratings']));
    } else {
      setAvgTimeRating('');
    }
  }, [recipeId, token, username, myTasteRating, myDifficultyRating, myTimeRating]);

  React.useEffect(() => {
    let getIngredients = context.recipe['ingredients'];
    let getInstructions = context.recipe['instructions'];
    let formattedIngredients = [];
    let formattedInstructions = [];
    getIngredients.forEach(function (element) {
      formattedIngredients.push('<li>' + element + '</li>');
    });
    document.getElementById('ingredients').innerHTML =
      formattedIngredients.join('');
    getInstructions.forEach(function (element) {
      formattedInstructions.push('<li>' + element + '</li>');
    });
    document.getElementById('instructions').innerHTML =
      formattedInstructions.join('');

    setShowSidebarTabOptions(false);
    fetchRatings();
  }, [context.recipe, setShowSidebarTabOptions, fetchRatings]);

  function handleTasteRating(index) {
    if (myTasteRating === index) {
      setMyTasteRating(0);
      removeRating(recipeId, token, 'taste');
    } else {
      setMyTasteRating(index);
      addRating(recipeId, index, token, 'taste');
    }
  }

  function handleDiffRating(index) {
    if (myDifficultyRating === index) {
      setMyDifficultyRating(0);
      removeRating(recipeId, token, 'diff');
    } else {
      setMyDifficultyRating(index);
      addRating(recipeId, index, token, 'diff');
    }
  }

  function handleTimeRating(index) {
    if (myTimeRating === index) {
      setMyTimeRating(0);
      removeRating(recipeId, token, 'time');
    } else {
      setMyTimeRating(index);
      addRating(recipeId, index, token, 'time');
    }
  }

  function getAvgRating(list) {
    let average = 0;
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      total += list[i]['rating'];
    }
    average = total / list.length;

    return average.toFixed(1);
  }

  const handleClose = (e) => {
    setAnchorEl(null);
  };

  const handleMoreButton = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    setOpenListPicker(true);
  };

  const handleAddToCalender = (e) => {
    setAnchorEl(null);
    setOpenDatePicker(true);
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
      recipes: [recipeId],
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
  }, [fetchLists, recipeId, token]);

  const removeFromFavourites = React.useCallback(async () => {
    const req = JSON.stringify({
      name: 'Favourites',
      recipes: [recipeId],
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
      if (myLists["Favourites"].includes(recipeId)) {
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
    <div className="recipe-page">
      <div id="recipe-page-contents">
        <div id="recipe-page-body">
          <div id="recipe-content">
            <div id="recipe-title">
              <div id="recipe-name-big">{context.recipe['title']}</div>
              {token ? (
                <div id="recipe-btn-group">
                  <div
                    id="favourite-btn"
                    onMouseOver={() => setHeartHover(true)}
                    onMouseLeave={() => setHeartHover(false)}
                    onClick={handleFavouriteButton}
                  >
                    {heartHover || myFavourite ? (
                      <FavoriteIcon sx={{ color: '#3BB927' }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </div>
                  <div id="more-btn" onClick={handleMoreButton}>
                    <MoreVertIcon />
                  </div>
                </div>
              ) : null}
            </div>
            <div id="recipe-top-content">
              <div style={style.imgDiv}>
                <CardMedia
                  id="recipe-img"
                  component="img"
                  image={
                    context.recipe['image'].hasOwnProperty('url')
                      ? context.recipe['image']['url']
                      : context.recipe['image']['base64']
                  }
                  style={style.img}
                />
              </div>
              <div id="recipe-top-right-content">
                <div id="recipe-details">
                  <div id="recipe-categories">
                    <div style={style.time}>
                      <span className="bold">Time:</span>
                      {` ${
                        context.recipe['time'] ? context.recipe['time'] : 'N/A'
                      }`}
                    </div>
                    <div>
                      <span className="bold">Servings:</span>
                      {` ${context.recipe['servings']}`}
                    </div>
                    <div style={style.spacing}>
                      <span className="bold">Diet:</span>
                      {context.recipe['diet']
                        ? ` ${context.recipe['diet']}`
                        : ' N/A'}
                    </div>
                    <div>
                      <span className="bold">Meal Type:</span>
                      {context.recipe['meal_type']
                        ? ` ${context.recipe['meal_type']}`
                        : ' N/A'}
                    </div>
                  </div>
                  <div id="rating-categories">
                    <div id="rating-group">
                      <span className="bold" style={style.rightSpace}>
                        Taste:
                      </span>
                      {username ? (
                        <div id="rating-star-group">
                          {[...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                              <button
                                type="button"
                                key={index}
                                className={`star-btn ${
                                  index > 0 ? 'star-space' : null
                                }`}
                                onClick={() => handleTasteRating(index)}
                                onMouseEnter={() => setStarTasteHover(index)}
                                onMouseLeave={() =>
                                  setStarTasteHover(myTasteRating)
                                }
                              >
                                {index <= (starTasteHover || myTasteRating) ? (
                                  <StarIcon sx={{ color: '#3BB927' }} />
                                ) : (
                                  <StarBorderIcon />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                      <div id="rating-text">
                        {tasteRatings.length > 0
                          ? `${avgTasteRating}${username ? '' : '/5'} (${
                              tasteRatings.length
                            } ${
                              tasteRatings.length !== 1 ? 'ratings)' : 'rating)'
                            }`
                          : 'No ratings'}
                      </div>
                    </div>
                    <div id="rating-group">
                      <span className="bold" style={style.rightSpace}>
                        Difficulty:
                      </span>
                      {username ? (
                        <div id="rating-star-group">
                          {[...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                              <button
                                type="button"
                                key={index}
                                className={`star-btn ${
                                  index > 0 ? 'star-space' : null
                                }`}
                                onClick={() => handleDiffRating(index)}
                                onMouseEnter={() =>
                                  setStarDifficultyHover(index)
                                }
                                onMouseLeave={() =>
                                  setStarDifficultyHover(myDifficultyRating)
                                }
                              >
                                {index <=
                                (starDifficultyHover || myDifficultyRating) ? (
                                  <StarIcon sx={{ color: '#3BB927' }} />
                                ) : (
                                  <StarBorderIcon />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                      <div id="rating-text">
                        {diffRatings.length > 0
                          ? `${avgDiffRating}${username ? '' : '/5'} (${
                              diffRatings.length
                            } ${
                              diffRatings.length !== 1 ? 'ratings)' : 'rating)'
                            }`
                          : 'No ratings'}
                      </div>
                    </div>
                    <div id="rating-group">
                      <span className="bold" style={style.rightSpace}>
                        Time:
                      </span>
                      {username ? (
                        <div id="rating-star-group">
                          {[...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                              <button
                                type="button"
                                key={index}
                                className={`star-btn ${
                                  index > 0 ? 'star-space' : null
                                }`}
                                onClick={() => handleTimeRating(index)}
                                onMouseEnter={() => setStarTimeHover(index)}
                                onMouseLeave={() =>
                                  setStarTimeHover(myTimeRating)
                                }
                              >
                                {index <= (starTimeHover || myTimeRating) ? (
                                  <StarIcon sx={{ color: '#3BB927' }} />
                                ) : (
                                  <StarBorderIcon />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                      <div id="rating-text">
                        {timeRatings.length > 0
                          ? `${avgTimeRating}${username ? '' : '/5'} (${
                              timeRatings.length
                            } ${
                              timeRatings.length !== 1 ? 'ratings)' : 'rating)'
                            }`
                          : 'No ratings'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={style.bottomContent}>
              <div>
                <span className="bold">Ingredients:</span>
                <ul id="ingredients"></ul>
              </div>
              <div style={style.spacing}>
                <span className="bold">Instructions:</span>
                <ol id="instructions"></ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={handleAddToList}
          sx={{ fontFamily: "'Outfit', sans-serif", color: '#484848' }}
        >
          Add to List
        </MenuItem>
        <MenuItem
          onClick={handleAddToCalender}
          sx={{ fontFamily: "'Outfit', sans-serif", color: '#484848' }}
        >
          Add to Calendar
        </MenuItem>
      </Menu>
      <DatePickerModal
        open={openDatePicker}
        setOpen={setOpenDatePicker}
        recipeInfo={context.recipe}
        task={'add'}
        date={new Date()}
        meal={'Breakfast'}
      />
      <ListPickerModal
        open={openListPicker}
        setOpen={setOpenListPicker}
        recipeID={recipeId}
      />
    </div>
  );
}

async function addRating(recipeId, rating, token, ratingCategory) {
  const response = await fetch(
    `/api/change/${ratingCategory}rating?recipeId=${recipeId}&rating=${rating}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const res = await response.json()
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 50);
  });
}

async function removeRating(recipeId, token, ratingCategory) {
  const response = await fetch(
    `/api/del/${ratingCategory}rating?recipeId=${recipeId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const res = await response.json();

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 50);
  });
}

async function getRating(recipeId, token, ratingCategory) {
  const response = await fetch(
    `/api/get/${ratingCategory}rating?recipeId=${recipeId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const res = await response.json()

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 50);
  });
}

import React from 'react';
import './account.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { AppContext } from '../../AppContext';
import RecipeCard from '../homepage/RecipeCard';
import RecipeModal from '../../RecipeModal';
import ListButton from './ListButton'

export default function Account() {
  const { token, username, setToken, setUsername } =
    React.useContext(AppContext);
  const [MyRecipes, setMyRecipes] = React.useState([]);
  const [openRecipeModal, setOpenRecipeModal] = React.useState(false);
  const [MyLists, setMyLists] = React.useState([]);

  const navigate = useNavigate();

  const handleLogout = (e) => {
    setToken(null);
    setUsername('');
    navigate('/');
  };

  const fetchDetails = React.useCallback(async () => {
    const response = await fetch(`/api/get/user/data`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    var acc_details = JSON.parse(res);
    if (acc_details.my_recipes !== undefined) {
      setMyRecipes(acc_details.my_recipes);
    }
    setMyLists(acc_details.my_lists);
  }, [token]);

  React.useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <div style={{ width: '100%' }}>
      {token == null ? (
        navigate('/login')
      ) : (
        <div className="Account-Page">
          <h1>Hi, {username}!</h1>
          <Button color="secondary" onClick={handleLogout} variant="contained">
            Logout
          </Button>
          <div className="accountinfo-Container">
            <h2>My Recipes:</h2>
            <Button
              className="add-button"
              onClick={() => navigate('/new-recipe')}
              variant="contained"
            >
              Add new recipe
            </Button>
            <div>
              {MyRecipes.length < 1 ? (
                <></>
              ) : (
                <div className="MyRecipiesContainer">
                  {MyRecipes.map((val, idx) => {
                    return <RecipeCard key={idx} recipe={val} />;
                  })}
                </div>
              )}
            </div>
            <h2>My Lists:</h2>
            <div>
              {MyLists.length < 1 ? (
                <ListButton name={'Favourites'} />
              ) : (
                <div className="MyListsContainer">
                  {MyLists.map((val) => {
                    return <ListButton key={val.name} name={val.name} />;
                  })}
                </div>
              )}
            </div>
          </div>

          {openRecipeModal ? (
            <RecipeModal open={openRecipeModal} setOpen={setOpenRecipeModal} />
          ) : null}
        </div>
      )}
    </div>
  );
}

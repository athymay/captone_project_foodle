import { CircularProgress, Typography } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import RecipeCard from '../../homepage/RecipeCard';
import { RecipeFormContext } from '../RecipeFormContext';

function CheckIngredients() {
  const { Ingredients } = useContext(RecipeFormContext);

  const [searching, setSearching] = useState(true);
  const [existing, setExisting] = useState([]);

  const searchExistingRecipes = useCallback(async () => {
    if (Ingredients.length === 0) return;

    const response = await fetch(`/api/ingredient/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Ingredients.map((info) => info.name)),
    });
    const res = await response.json();
    if (res) {
      setExisting(JSON.parse(res));
    }
    setSearching(false);
  }, [Ingredients]);

  useEffect(() => {
    searchExistingRecipes();
  }, [searchExistingRecipes]);

  if (Ingredients.length === 0) {
    return (
      <Typography sx={{ my: '20px' }}>
        A recipe with no ingredients? Interesting! Click the CONTINUE button to
        proceed.
      </Typography>
    );
  }

  if (searching) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          margin: '20px',
        }}
      >
        <CircularProgress size={30} />
        <Typography>
          Checking to see if anyone has also submitted a recipe using your exact
          ingredients...
        </Typography>
      </div>
    );
  }

  if (existing.length === 0) {
    return (
      <Typography sx={{ my: '20px' }}>
        This will be the first recipe that uses this ingredient combination!
        Click the CONTINUE button to proceed.
      </Typography>
    );
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <Typography>
        {`${
          existing.length === 1 ? 'A recipe that uses' : 'Some recipes that use'
        } the same ingredients already exist. Please ensure that you avoid submitting the same recipe as another person.`}
      </Typography>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {existing.map((recipe, i) => (
          <div style={{ width: '300px' }}>
            <RecipeCard key={i} recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckIngredients;

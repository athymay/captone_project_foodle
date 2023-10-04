import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import React from 'react';
import { AppContext } from '../../AppContext';
import RecipeModal from '../../RecipeModal';
import FiltersDialogAndButton from './filters-modal/FiltersDialogAndButton';
import RecipeCard from './RecipeCard';
import SortSelector from './SortSelector';

export default function HomePage() {
  const {
    recipes,
    setRecipes,
    setShowSidebarTabOptions,
    recipeFetchInProgress: fetching,
    setRecipeFetchInProgress: setFetching,
  } = React.useContext(AppContext);
  const [page, setPage] = React.useState(1);

  const [recipeSearchText, setRecipeSearchText] = React.useState('');
  const [openRecipeModal, setOpenRecipeModal] = React.useState(false);

  const handleChange = (event, value) => {
    setPage(value);
  };

  function getPaginatedData() {
    const startIndex = page * 24 - 24;
    const endIndex = startIndex + 24;
    return recipes.slice(startIndex, endIndex);
  }

  async function searchRecipes() {
    setFetching(true);

    const req = JSON.stringify({
      keywords: recipeSearchText.split(' '),
    });
    const response = await fetch(`/api/recipe/search`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: req,
    });
    const recipe = await response.json();
    var array = JSON.parse(recipe);
    setRecipes(array);

    setFetching(false);
  }

  const pageCount = React.useMemo(
    () => Math.ceil(recipes.length / 24) || 1,
    [recipes.length]
  );

  function handleRecipeSearch(e) {
    setRecipeSearchText(e.target.value);
  }

  React.useEffect(() => {
    setShowSidebarTabOptions(true);
  }, [setShowSidebarTabOptions]);

  return (
    <>
      <div className="search-bar-group">
        <input
          className="search-bar"
          type="text"
          placeholder="Search for a recipe"
          onChange={handleRecipeSearch}
        />
        <div className="search-button" onClick={searchRecipes}>
          <SearchIcon className="search-icon" />
        </div>
      </div>

      {fetching ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            fontSize: '25pt',
          }}
        >
          <CircularProgress size={100} />
          Loading Recipes...
        </div>
      ) : (
        <div id="recipes-body">
          <div id="recipe-filters">
            <div id="recipe-results-text">
              {recipes.length === 1
                ? `${recipes.length} recipe`
                : `${recipes.length} recipes`}
            </div>
            <div id="recipe-filters-btn-group">
              <SortSelector />
              <FiltersDialogAndButton />
            </div>
          </div>
          {recipes.length > 0 ? (
            <>
              <div className="display-recipes">
                {getPaginatedData().map((val, idx) => {
                  return (
                    <RecipeCard
                      key={idx}
                      recipe={val}
                      setOpenRecipeModal={setOpenRecipeModal}
                    />
                  );
                })}
              </div>
              <Stack id="stack" spacing={2}>
                <Pagination
                  id="pagination"
                  count={pageCount}
                  page={page}
                  onChange={handleChange}
                  sx={{
                    button: {
                      color: '#484848',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '12pt',
                    },
                    '.Mui-selected': {
                      fontWeight: '600',
                      backgroundColor: '#484848 !important',
                      color: 'white',
                    },
                    '.Mui-selected:hover': {
                      backgroundColor: '#686868 !important',
                    },
                  }}
                />
              </Stack>
            </>
          ) : (
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                height: '100%',
                fontSize: '20pt',
              }}
            >
              No recipes matched your search criteria. Please recheck your
              filters, added ingredients, or search keywords.
            </div>
          )}
        </div>
      )}

      {openRecipeModal ? (
        <RecipeModal open={openRecipeModal} setOpen={setOpenRecipeModal} />
      ) : null}
    </>
  );
}

import { useContext, useMemo, useState } from 'react';

import { RecipeFormContext } from '../RecipeFormContext';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ExpandMore } from '@mui/icons-material';
import { AppContext } from '../../../AppContext';
import { IngredientsType } from '../../../shared/types';
import { Typography } from '@mui/material';
import SuggestIngredientButton from './suggest-ingredient/SuggestIngredientButton';
import SuggestIngredientDialog from './suggest-ingredient/SuggestIngredientDialog';

export default function IngredientsSelect() {
  const { Ingredients, setIngredients } = useContext(RecipeFormContext);
  const { CategoryIngredients } = useContext(AppContext);

  const IngredientsList = useMemo(() => {
    const ingredientsInfo: IngredientsType = [];

    for (const category of CategoryIngredients) {
      for (const ingredient of category.ingredients) {
        ingredientsInfo.push({
          category: category.categoryName,
          name: ingredient,
        });
      }
    }

    ingredientsInfo.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );

    return ingredientsInfo;
  }, [CategoryIngredients]);

  const SelectedIngredientsList = useMemo(() => {
    const ingredientsInfo: { [category: string]: string[] } = {};

    Ingredients.forEach(({ category, name }) => {
      if (ingredientsInfo[category]) {
        ingredientsInfo[category].push(name);
      } else {
        ingredientsInfo[category] = [name];
      }
    });

    Object.values(ingredientsInfo).forEach((list) =>
      list.sort((a, b) => a.localeCompare(b))
    );

    return ingredientsInfo;
  }, [Ingredients]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <Autocomplete
          multiple
          value={Ingredients}
          onChange={(_event, newValue) => {
            setIngredients(newValue as IngredientsType);
          }}
          options={IngredientsList}
          groupBy={(option) =>
            typeof option === 'string' ? '' : option.category
          }
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.name
          }
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ingredients"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          popupIcon={<ExpandMore />}
          noOptionsText={<SuggestIngredientButton setOpen={setOpen} />}
          sx={{ width: 300 }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            marginTop: '20px',
          }}
        >
          {Object.entries(SelectedIngredientsList).map(
            ([category, ingredients]) => (
              <div style={{ padding: '0 20px' }}>
                <span className="ingredient-heading">{category}</span>
                <ul>
                  {ingredients.map((ingredient) => (
                    <li
                      onClick={() => {
                        setIngredients((prev) =>
                          prev.filter((i) => i.name !== ingredient)
                        );
                      }}
                    >
                      <Typography
                        sx={{
                          '&:hover': {
                            textDecoration: 'line-through',
                          },
                        }}
                      >
                        {ingredient}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>

      <SuggestIngredientDialog open={open} handleClose={handleClose} />
    </>
  );
}

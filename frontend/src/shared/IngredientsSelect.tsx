import { Dispatch, SetStateAction, useContext, useMemo } from 'react';

import { IngredientsType } from './types';
import { AppContext } from '../AppContext';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { ExpandMore } from '@mui/icons-material';

export default function IngredientsSelect({
  Ingredients,
  setIngredients,
  label,
}: {
  Ingredients: IngredientsType;
  setIngredients: Dispatch<SetStateAction<IngredientsType>>;
  label: string;
}) {
  const { CategoryIngredients } = useContext(AppContext);

  const IngredientsList = useMemo(() => {
    const ingredientsInfo = [];

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

  return (
    <>
      <Stack spacing={3}>
        <Autocomplete
          multiple
          value={Ingredients}
          onChange={(_event, newValue) => {
            setIngredients(newValue);
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
              label={label}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          popupIcon={<ExpandMore />}
          noOptionsText="No ingredient found"
        />
      </Stack>
    </>
  );
}

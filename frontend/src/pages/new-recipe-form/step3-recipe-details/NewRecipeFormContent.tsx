import { ChangeEvent, RefObject, useCallback, useContext } from 'react';

import { RecipeFormContext } from '../RecipeFormContext';
import { Diets } from '../../../shared/types';
import MealTypeSelect from '../../../shared/MealTypeSelect';
import { NumberInput } from '../../../mui-treasury-components/number-input/NumberInput';
import ImageDropzone from './image-dropzone/ImageDropzone';

import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import IngredientQuantityTextBox from './IngredientQuantityTextBox';

export default function NewRecipeFormContent({
  formRef,
}: {
  formRef?: RefObject<HTMLFormElement>;
}) {
  const {
    Name,
    setName,
    Ingredients,
    setIngredients,
    Method,
    setMethod,
    Servings,
    setServings,
    Time,
    setTime,
    Diet,
    setDiet,
    MealType,
    setMealType,
  } = useContext(RecipeFormContext);

  const handleChange = useCallback(
    (ingredient: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setIngredients((array) => {
        array.filter(({ name }) => name === ingredient)[0].qty = event.target
          .value as string;
        return array;
      });
    },
    [setIngredients]
  );

  return (
    <form ref={formRef}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '2em',
        }}
      >
        <ImageDropzone />

        <div>
          <TextField
            fullWidth
            required
            label="Name"
            value={Name}
            margin="normal"
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Typography variant="subtitle1" sx={{ mt: '10px' }}>
            Ingredient Quantities *
          </Typography>
          {Ingredients.length === 0 ? (
            <ul>
              <li>No ingredients!</li>
            </ul>
          ) : (
            Ingredients.sort((a, b) => a.name.localeCompare(b.name)).map(
              ({ name, qty }) => (
                <IngredientQuantityTextBox
                  ingredient={name}
                  quantity={qty}
                  handleChange={handleChange}
                />
              )
            )
          )}
        </div>
      </div>

      <TextField
        fullWidth
        required
        label="Method"
        value={Method}
        margin="normal"
        onChange={(e) => setMethod(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setMethod(`${Method}\n${Method.split('\n').length + 1}. `);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        multiline
        minRows={7}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <div
        style={{
          display: 'flex',
          gap: '0 2em',
          flexWrap: 'wrap',
        }}
      >
        <FormControl margin="normal" sx={{ flex: '1 0 140px' }}>
          <InputLabel htmlFor="new-recipe-select-Servings" shrink required>
            Servings
          </InputLabel>
          <NumberInput
            required
            id="new-recipe-select-Servings"
            label="Servings"
            min={1}
            value={Servings}
            onChange={(value) =>
              typeof value === 'number' && setServings(value)
            }
            notched
          />
        </FormControl>

        <FormControl margin="normal" sx={{ flex: '1 0 140px' }}>
          <InputLabel htmlFor="new-recipe-select-Time" shrink>
            Time
          </InputLabel>
          <NumberInput
            id="new-recipe-select-Time"
            label="Time"
            min={1}
            value={Time}
            onChange={(value) => typeof value === 'number' && setTime(value)}
            endAdornment={<InputAdornment position="end">mins</InputAdornment>}
            notched
          />
        </FormControl>

        <FormControl margin="normal" sx={{ flex: '1 0 400px' }}>
          <InputLabel id="new-recipe-select-Diet" shrink>
            Diet
          </InputLabel>
          <Select
            labelId="new-recipe-select-Diet"
            value={Diet}
            label="Diet"
            IconComponent={ExpandMore}
            onChange={(e) => {
              const value = e.target.value;
              setDiet(
                (typeof value === 'string'
                  ? value.split(',')
                  : value) as typeof Diet
              );
            }}
            multiple
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            notched
          >
            {Diets.map((item, i) => (
              <MenuItem key={i} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <MealTypeSelect
          MealType={MealType}
          setMealType={setMealType}
          formControlSx={{ flex: '1 0 140px' }}
        />
      </div>
    </form>
  );
}

import { Circle } from '@mui/icons-material';
import { FormControl, InputAdornment, Input } from '@mui/material';
import { ChangeEventHandler } from 'react';

function IngredientQuantityTextBox({
  ingredient,
  quantity,
  handleChange,
}: {
  ingredient: string;
  quantity: string | undefined;
  handleChange: (
    ingredient: string
  ) => ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Circle sx={{ height: '7px' }} />
      <FormControl sx={{ m: 1, maxWidth: '50ch' }} fullWidth>
        <Input
          required
          fullWidth
          value={quantity}
          onChange={handleChange(ingredient)}
          endAdornment={
            <InputAdornment position="end">{ingredient}</InputAdornment>
          }
          inputProps={{
            'aria-label': `${ingredient} quantity`,
          }}
        />
      </FormControl>
    </div>
  );
}

export default IngredientQuantityTextBox;

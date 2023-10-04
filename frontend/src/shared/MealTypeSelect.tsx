import { Dispatch, SetStateAction } from 'react';

import { MealTypes, MealType as MealTypeType } from './types';

import { ExpandMore } from '@mui/icons-material';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
  Theme,
} from '@mui/material';

export default function MealTypeSelect({
  MealType,
  setMealType,
  formControlSx,
}: {
  MealType: MealTypeType | '';
  setMealType: Dispatch<SetStateAction<MealTypeType | ''>>;
  formControlSx?: SxProps<Theme>;
}) {
  return (
    <FormControl margin="normal" sx={formControlSx || {}}>
      <InputLabel id="new-recipe-select-MealType" shrink>
        Meal Type
      </InputLabel>
      <Select
        labelId="new-recipe-select-MealType"
        value={MealType}
        label="MealType"
        IconComponent={ExpandMore}
        onClick={(e: any) => {
          const value = e.target.getAttribute('data-value') as MealTypeType;
          setMealType((prev) => (!value || prev === value ? '' : value));
        }}
        notched
      >
        {MealTypes.map((item, i) => (
          <MenuItem key={i} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

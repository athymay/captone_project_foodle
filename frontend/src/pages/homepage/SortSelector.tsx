import { KeyboardArrowDown } from '@mui/icons-material';
import { FormControl, Select, MenuItem } from '@mui/material';
import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { SortType, SortTypes } from '../../shared/types';

function SortSelector() {
  const { sort, setSort } = useContext(AppContext);
  return (
    <FormControl>
      <Select
        value={sort}
        defaultValue="Ratings: High to Low"
        onChange={(e) => setSort(e.target.value as SortType)}
        IconComponent={KeyboardArrowDown}
        sx={{ '& > .MuiSelect-select': { py: 1.5 } }}
      >
        {SortTypes.map((s, i) => (
          <MenuItem key={i} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SortSelector;

import { useState, useRef, useContext, useEffect, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import {
  DietaryRequirements,
  MealType as MealTypeType,
  Diets,
  IngredientsType,
  EmptyFilter,
} from '../../../shared/types';
import TimeRange from './TimeRange';
import IngredientsSelect from '../../../shared/IngredientsSelect';
import { NumberInput } from '../../../mui-treasury-components/number-input/NumberInput';
import MealTypeSelect from '../../../shared/MealTypeSelect';
import { AppContext } from '../../../AppContext';

export default function FiltersDialogAndButton() {
  const { filter, setFilter } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [ExcludeIngredients, setExcludeIngredients] = useState<IngredientsType>(
    []
  );
  const [Servings, setServings] = useState<number | undefined>(undefined);
  const [Time, setTime] = useState<[number, number] | [number]>([0, 200]);
  const [Diet, setDiet] = useState<DietaryRequirements>([]);
  const [MealType, setMealType] = useState<MealTypeType | ''>('');

  const checkFilterActiveStatus = useCallback(
    () =>
      filter.ExcludeIngredients.length === 0 &&
      !filter.Servings &&
      filter.Time[0] === 0 &&
      filter.Time[1] === 200 &&
      filter.Diet.length === 0 &&
      filter.MealType === '',
    [
      filter.Diet,
      filter.ExcludeIngredients,
      filter.MealType,
      filter.Servings,
      filter.Time,
    ]
  );

  const [isEmptyFilter, setIsEmptyFilter] = useState(checkFilterActiveStatus());

  function resetFilter() {
    setExcludeIngredients(EmptyFilter.ExcludeIngredients);
    setServings(EmptyFilter.Servings);
    setTime(EmptyFilter.Time);
    setDiet(EmptyFilter.Diet);
    setMealType(EmptyFilter.MealType);
  }

  const handleClickOpen = () => {
    setOpen(true);
    setExcludeIngredients(filter.ExcludeIngredients);
    setServings(filter.Servings);
    setTime(filter.Time);
    setDiet(filter.Diet);
    setMealType(filter.MealType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkActive = useCallback(() => {
    if (!open) {
      setIsEmptyFilter(checkFilterActiveStatus());
    }
  }, [checkFilterActiveStatus, open]);

  useEffect(checkActive, [checkActive]);

  async function saveFilter() {
    if (!formRef.current?.reportValidity()) return;

    setFilter({ ExcludeIngredients, Servings, Time, Diet, MealType });
    handleClose();
  }

  return (
    <div>
      <Button
        id="filters-btn"
        className="button-outline"
        variant="outlined"
        color={isEmptyFilter ? 'secondary' : 'primary'}
        endIcon={<TuneIcon />}
        onClick={handleClickOpen}
        sx={{ textTransform: 'none' }}
      >
        <Typography className="btn-text">Filters</Typography>
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Filters</DialogTitle>
        <Divider />
        <Container maxWidth="sm" sx={{ my: 1 }}>
          <DialogContent>
            <form ref={formRef}>
              <IngredientsSelect
                Ingredients={ExcludeIngredients}
                setIngredients={setExcludeIngredients}
                label="Exclude"
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  columnGap: '2em',
                }}
              >
                <FormControl margin="normal" fullWidth>
                  <InputLabel htmlFor="new-recipe-select-Servings" shrink>
                    Servings
                  </InputLabel>
                  <NumberInput
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

                <TimeRange Time={Time} setTime={setTime} />

                <FormControl margin="normal" fullWidth>
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

                <MealTypeSelect MealType={MealType} setMealType={setMealType} />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <div
              style={{
                width: '100%',
                display: 'grid',
                justifyContent: 'center',
                rowGap: '10px',
              }}
            >
              <Button
                variant="outlined"
                className="form-button"
                onClick={(e) => {
                  e.preventDefault();
                  saveFilter();
                }}
              >
                Save
              </Button>
              <Button
                className="form-button"
                onClick={(e) => {
                  e.preventDefault();
                  resetFilter();
                }}
              >
                Reset Filters
              </Button>
            </div>
          </DialogActions>
        </Container>
      </Dialog>
    </div>
  );
}

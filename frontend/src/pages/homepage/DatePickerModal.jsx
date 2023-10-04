import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AppContext } from '../../AppContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        color: '#484848',
        fontFamily: "'Outfit', sans-serif",
        textAlign: 'center',
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#484848',
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function DatePickerModal(props) {
  const { open, setOpen, recipeInfo, task, date, meal, setUpdate } = props;
  const [selectedDate, setSelectedDate] = React.useState(date);
  const [mealType, setMealType] = React.useState(meal);
  const { token } = React.useContext(AppContext);

  const handleChange = (event) => {
    setMealType(event.target.value);
  };

  const handleClose = (e) => {
    e.stopPropagation()
    setOpen(false);
  }

  function handleAdd() {
    var dateStr = selectedDate.getFullYear() + "-" + ("0"+(selectedDate.getMonth()+1)).slice(-2) + "-" + ("0" + selectedDate.getDate()).slice(-2)
    addMealPlan(token, mealType, dateStr, recipeInfo)
    setOpen(false)
  }

  function handleEdit() {
    var dateStr = selectedDate.getFullYear() + "-" + ("0"+(selectedDate.getMonth()+1)).slice(-2) + "-" + ("0" + selectedDate.getDate()).slice(-2)
    var oldDate = date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
    editMealPlan(token, mealType, dateStr, recipeInfo, meal, oldDate)
    setUpdate(true)
    setOpen(false)
  }

  const handlePropagation = (e) => {
    e.stopPropagation()
  }

  /*
  React.useEffect(() => {
    if (task === "edit") {
      setMealType(oldMeal)
      setSelectedDate(new Date(oldDate))
    }
  }, []);*/

  return (
    <div>
      <BootstrapDialog
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
        id="date-picker-modal"
        onClick={handlePropagation}
      >
        <BootstrapDialogTitle onClose={handleClose}>
          {task === 'add' ? 'Add Recipe to Calendar' : 'Edit Recipe'}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <FormControl
            sx={{ m: 1, width: '300px', display: 'flex', alignItems: 'center' }}
          >
            <FormLabel
              sx={{
                m: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                color: '#484848',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '600',
              }}
            >
              Meal Type
            </FormLabel>
            <Select
              value={mealType}
              onChange={handleChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{
                width: '100%',
                color: '#484848',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <MenuItem
                value={'Breakfast'}
                sx={{
                  color: '#484848',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Breakfast
              </MenuItem>
              <MenuItem
                value={'Lunch'}
                sx={{
                  color: '#484848',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Lunch
              </MenuItem>
              <MenuItem
                value={'Dinner'}
                sx={{
                  color: '#484848',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Dinner
              </MenuItem>
            </Select>
            <FormLabel
              sx={{
                paddingTop: '40px',
                m: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                color: '#484848',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '600',
              }}
            >
              Select Date
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disablePast
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
                InputProps={{
                  sx: { '& .MuiSvgIcon-root': { color: '#484848' } },
                }}
                PopperProps={{
                  sx: {
                    '& .MuiPaper-root': {
                      fontFamily: "'Outfit', sans-serif",
                      color: '#484848',
                    },
                    '& .MuiPickersDay-dayWithMargin': {
                      fontFamily: "'Outfit', sans-serif",
                      color: '#484848',
                      fontSize: '10pt',
                    },
                    '& .Mui-selected': {
                      color: 'white',
                      backgroundColor: '#3BB927 !important',
                    },
                    '& .css-l0iinn': {
                      fontFamily: "'Outfit', sans-serif",
                    },
                    button: {
                      fontFamily: "'Outfit', sans-serif",
                    },
                    '& .MuiTypography-root': {
                      fontFamily: "'Outfit', sans-serif",
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="date-picker-modal"
                    sx={{
                      width: '100%',
                      paddingBottom: '20px',
                      '.MuiInputBase-root': {
                        color: '#484848',
                        fontFamily: "'Outfit', sans-serif",
                      },
                      '.MuiCalendarPicker-root': {
                        color: '#484848',
                        fontFamily: "'Outfit', sans-serif",
                      },
                      button: {
                        fontFamily: "'Outfit', sans-serif",
                      },
                      '.Mui-selected': {
                        fontFamily: "'Outfit', sans-serif",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={task === 'add' ? handleAdd : handleEdit}
            sx={{
              color: 'white',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '12pt',
              backgroundColor: '#3BB927',
              m: 1,
              borderRadius: '5px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#30841c',
              },
            }}
          >
            {task === 'add' ? 'Add' : 'Edit'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

async function addMealPlan(token, mealType, date, recipe) {
  const body = {
    "date": date,
    "meal": mealType,
    "recipes": [
      recipe["_id"]["$oid"]
    ]
  }

  await axios
    .post(`/api/user/myCalendar/addMealPlan/`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      if (err.response.status === 400) {
        console.error(err.response.data);
      } else if (err.response.status === 403) {
        console.error(err.response.data);
      }
    });
}

async function editMealPlan(token, mealType, date, recipe, oldMeal, oldDate) {
  const body = {
    "recipe": recipe["_id"]["$oid"],
    "oldMeal": oldMeal,
    "newMeal": mealType,
    "oldDate": oldDate,
    "newDate": date
  }

  await axios
    .post(`/api/user/myCalendar/moveRecipe/`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      if (err.response.status === 400) {
        console.error(err.response.data);
      } else if (err.response.status === 403) {
        console.error(err.response.data);
      }
    });
}

import * as React from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';

import {AppContext} from '../../AppContext';

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

export default function ListPickerModal(props) {
  const { open, setOpen, recipeID } = props;
  const { token, myLists, fetchLists } = React.useContext(AppContext);
  const [allLists, setAllLists] = React.useState(['']);
  const [list, setList] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    setAllLists(Object.keys(myLists));
  }, [myLists]);

  const handleSubmit = (e) => {
    setErrorMsg('');
    if (list === '') {
      setErrorMsg("Please enter a new list or select one from below");
    } else {
      addToList();
      e.stopPropagation()
      setOpen(false);
    }
  }
  const handleCloseBtn = (e) => {
    e.stopPropagation()
    setOpen(false);
  }

  function handleListClick(e, newValue) {
    e.preventDefault();
    setList(newValue);
  }

  function handleInputChange(e, newInputValue) {
    e.preventDefault();
    setList(newInputValue);
  }

  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  const addToList = React.useCallback(async () => {
    const req = JSON.stringify({
      name: list,
      recipes: [recipeID],
    });
    const response = await fetch(`/api/user/mylists/createUpdateList`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req,
    });
    await response.json();
    await fetchLists();
  }, [fetchLists, list, recipeID, token]);

  return (
    <div>
      <BootstrapDialog
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseBtn();
          }
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
        id="date-picker-modal"
        onClick={handlePropagation}
      >
        <BootstrapDialogTitle onClose={handleCloseBtn}>
          Add to List
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div
            className="ErrorTxt"
            style={{ width: '90%', paddingLeft: '10px' }}
          >
            {errorMsg}
          </div>
          <Autocomplete
            sx={{ m: 1, width: '325px', display: 'flex', alignItems: 'center' }}
            options={allLists}
            freeSolo
            onChange={handleListClick}
            onInputChange={handleInputChange}
            PaperComponent={({ children }) => (
              <Paper
                style={{ fontFamily: "'Outfit', sans-serif", color: '#484848' }}
              >
                {children}
              </Paper>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for a list or input a new one!"
                sx={{
                  '.MuiOutlinedInput-input': {
                    fontFamily: "'Outfit', sans-serif",
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleSubmit}
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
            Add to List
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

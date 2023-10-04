import { Dispatch, SetStateAction } from 'react';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function FormDialog({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Button
      onClick={handleClickOpen}
      startIcon={<AddIcon />}
      sx={{
        textTransform: 'none',
      }}
    >
      Suggest Ingredient
    </Button>
  );
}

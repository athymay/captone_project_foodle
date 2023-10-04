import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';

export default function NewRecipeButton() {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={2} sx={{ mr: '15px', mt: '5px' }}>
      <Button
        onClick={() => navigate('/new-recipe')}
        startIcon={<AddIcon />}
        sx={{
          textTransform: 'none',
          color: 'white',
          '& .MuiButton-startIcon': {
            mr: '4px',
          },
          fontFamily: "'Outfit', sans-serif",
          fontSize: '12pt'
        }}
      >
        New Recipe
      </Button>
    </Stack>
  );
}

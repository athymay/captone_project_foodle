import { useState, useRef, useMemo, useContext, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import SubmitButton from '../../SubmitButton';
import { AppContext } from '../../../../AppContext';

export default function FormDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { CategoryIngredients } = useContext(AppContext);

  const formRef = useRef<HTMLFormElement>(null);

  const [IngredientName, setIngredientName] = useState('');
  const [Category, setCategory] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const CategoryList: string[] = useMemo(() => {
    return CategoryIngredients.map((category) => category.categoryName).sort(
      (a, b) => a.localeCompare(b)
    );
  }, [CategoryIngredients]);

  async function submitNewIngredient() {
    if (!formRef.current?.reportValidity()) return;

    const req = JSON.stringify({
      ingredient: IngredientName.toLowerCase(),
      category: Category,
    });
    const response = await fetch(`/api/ingredientsuggestion`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: req,
    });
    if (response.ok) {
      setSuccessMsg(
        "A request for your new ingredient has been sent to the admins.\nIt won't be available for use immediately. Please wait until it gets approved."
      );
    } else {
      const error = await response.json();
      setError('Error: ' + error.detail);
    }
  }

  useEffect(() => {
    setSuccessMsg(null);
    setError(null);
    setIngredientName('');
    setCategory('');
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Suggest Ingredient</DialogTitle>
      <Divider />
      <Container maxWidth="sm" sx={{ mt: 12, mb: 15 }}>
        {successMsg ? (
          <p style={{ color: 'green', textAlign: 'center' }}>{successMsg}</p>
        ) : (
          <>
            <DialogContent>
              <form ref={formRef}>
                <TextField
                  required
                  margin="normal"
                  fullWidth
                  label="Ingredient Name"
                  value={IngredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={Boolean(error)}
                />

                <FormControl margin="normal" fullWidth>
                  <InputLabel id="add-ingredient-from-category" required shrink>
                    Category
                  </InputLabel>
                  <Select
                    required
                    labelId="add-ingredient-from-category"
                    value={Category}
                    label="Category"
                    IconComponent={ExpandMore}
                    onChange={(e) =>
                      setCategory(e.target.value as typeof Category)
                    }
                    notched
                    error={Boolean(error)}
                  >
                    {CategoryList.map((item, i) => (
                      <MenuItem key={i} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {error && <p style={{ color: 'red' }}>{error}</p>}
              </form>
            </DialogContent>
            <DialogActions>
              <SubmitButton handleSubmit={submitNewIngredient} />
            </DialogActions>
          </>
        )}
      </Container>
    </Dialog>
  );
}

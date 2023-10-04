import { useCallback, useContext, useMemo, useRef } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { RecipeFormContext } from './RecipeFormContext';
import SelectIngredients from './step1-select-ingredients/SelectIngredients';
import CheckIngredients from './step2-check-ingredients/CheckIngredients';
import NewRecipeFormContent from './step3-recipe-details/NewRecipeFormContent';
import { AppContext } from '../../AppContext';

interface RecipeRequestBody {
  user_name: string;
  name: string;
  ingredients: string[];
  ingredients_index: string[];
  method: string[];
  servings?: number;
  time?: string;
  diet?: string[];
  meal_type?: string;
  image?: string;
}

export default function VerticalLinearStepper() {
  const { username } = useContext(AppContext);
  const {
    Name,
    Ingredients,
    Method,
    Servings,
    Time,
    Diet,
    MealType,
    image,
    reset,
    activeStep,
    setActiveStep,
  } = useContext(RecipeFormContext);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [setActiveStep]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
  };

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!formRef.current?.reportValidity()) return;

    const formBody: RecipeRequestBody = {
      user_name: username,
      name: Name,
      ingredients: Ingredients.map((ingredient) =>
        ingredient.qty
          ? `${ingredient.qty?.trim()} ${ingredient.name}`
          : ingredient.name
      ),
      ingredients_index: Ingredients.map((ingredient) => ingredient.name),
      method: Method.split('\n').map((line) =>
        line.replace(/^\d+. /, '').trim()
      ),
      servings: Servings,
      time: Time ? `${Time} mins` : undefined,
      diet: Diet,
      meal_type: MealType ? MealType : 'Uncategorised Recipes',
      image: image as string,
    };

    const req = JSON.stringify(formBody);
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/recipe`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req,
    });
    if (response.ok) {
      handleNext();
    } else {
      console.error({ response });
    }
  }, [
    Diet,
    Ingredients,
    MealType,
    Method,
    Name,
    Servings,
    Time,
    handleNext,
    image,
    username,
  ]);

  const steps = useMemo(
    () => [
      {
        label: 'Select the ingredients your recipe will use',
        content: <SelectIngredients />,
        onNextClick: handleNext,
      },
      {
        label:
          "We do an additional check to make sure you don't submit a recipe that already exists on this site",
        content: <CheckIngredients />,
        onNextClick: handleNext,
      },
      {
        label: 'Fill in your recipe details',
        content: <NewRecipeFormContent formRef={formRef} />,
        onNextClick: handleSubmit,
      },
    ],
    [handleNext, handleSubmit]
  );

  return (
    <Container>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              <Typography variant="h6">{step.label}</Typography>
            </StepLabel>
            <StepContent>
              {step.content}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={step.onNextClick}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <div
          style={{
            display: 'grid',
            alignContent: 'center',
            justifyItems: 'center',
            height: '100%',
            gridGap: '20px',
          }}
        >
          <Typography variant="h6">New Recipe Submitted</Typography>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<AddIcon />}
            sx={{
              textTransform: 'none',
            }}
          >
            Add New Recipe
          </Button>
        </div>
      )}
    </Container>
  );
}

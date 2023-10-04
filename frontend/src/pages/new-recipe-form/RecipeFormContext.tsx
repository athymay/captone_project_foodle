import { createContext, Dispatch, SetStateAction, useState } from 'react';
import {
  DietaryRequirements,
  MealType as MealTypeType,
  IngredientsType,
} from '../../shared/types';

interface RecipeFormContextValues {
  Name: string;
  setName: Dispatch<SetStateAction<string>>;
  Ingredients: IngredientsType;
  setIngredients: Dispatch<SetStateAction<IngredientsType>>;
  Method: string;
  setMethod: Dispatch<SetStateAction<string>>;
  Servings: number | undefined;
  setServings: Dispatch<SetStateAction<number | undefined>>;
  Time: number | undefined;
  setTime: Dispatch<SetStateAction<number | undefined>>;
  Diet: DietaryRequirements;
  setDiet: Dispatch<SetStateAction<DietaryRequirements>>;
  MealType: MealTypeType | '';
  setMealType: Dispatch<SetStateAction<MealTypeType | ''>>;
  image: string | ArrayBuffer | null;
  setImage: Dispatch<SetStateAction<string | ArrayBuffer | null>>;
  reset: () => void;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const RecipeFormContext = createContext({} as RecipeFormContextValues);

function RecipeFormProvider({ children }: { children: React.ReactNode }) {
  const [Name, setName] = useState<string>('');
  const [Ingredients, setIngredients] = useState<IngredientsType>([]);
  const [Method, setMethod] = useState<string>('1. ');
  const [Servings, setServings] = useState<number | undefined>(undefined);
  const [Time, setTime] = useState<number | undefined>(undefined);
  const [Diet, setDiet] = useState<DietaryRequirements>([]);
  const [MealType, setMealType] = useState<MealTypeType | ''>('');
  const [image, setImage] = useState<string | ArrayBuffer | null>('');

  const [activeStep, setActiveStep] = useState(0);

  function reset() {
    setName('');
    setIngredients([]);
    setMethod('1. ');
    setServings(undefined);
    setTime(undefined);
    setDiet([]);
    setMealType('');
    setImage('');
  }

  return (
    <RecipeFormContext.Provider
      value={{
        Name,
        setName,
        Ingredients,
        setIngredients,
        Method,
        setMethod,
        Servings,
        setServings,
        Time,
        setTime,
        Diet,
        setDiet,
        MealType,
        setMealType,
        image,
        setImage,
        reset,
        activeStep,
        setActiveStep,
      }}
    >
      {children}
    </RecipeFormContext.Provider>
  );
}
export default RecipeFormProvider;

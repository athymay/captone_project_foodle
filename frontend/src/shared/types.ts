export const Diets = [
  'gluten-free',
  'dairy-free',
  'vegetarian',
  'vegan',
] as const;
export type DietaryRequirements = typeof Diets[number][];

export const MealTypes = ['Mains', 'Snacks', 'Desserts', 'Starters'] as const;
export type MealType = typeof MealTypes[number];

export type IngredientType = {
  category: string;
  name: string;
  qty?: string;
};
export type IngredientsType = IngredientType[];

export interface RecipeResponsePayload {
  author: string;
  dietary_requirements: DietaryRequirements;
  image: { url: string; base64?: never } | { url?: never; base64: string };
  ingredients: string[];
  instructions: string[];
  meal_type: string;
  rating: number | null;
  servings: string;
  time: string | null;
  title: string | null;
}

export interface FilterType {
  ExcludeIngredients: IngredientsType;
  Servings: number | undefined;
  Time: [number, number] | [number];
  Diet: DietaryRequirements;
  MealType: MealType | '';
}

export const EmptyFilter = {
  ExcludeIngredients: [],
  Servings: undefined,
  Time: [0, 200],
  Diet: [],
  MealType: '',
} as FilterType;

export interface FilterParams {
  user_name?: string;
  diet?: string[];
  exclude?: string[];
  meal_type?: string;
  num_servings?: number;
  time?: [number, number] | [number];
  sort?: 'rating' | 'time';
  order?: 'low' | 'high';
}

export const SortTypes = [
  'Ratings: Low to High',
  'Ratings: High to Low',
  'Time: Low to High',
  'Time: High to Low',
] as const;
export type SortType = typeof SortTypes[number];

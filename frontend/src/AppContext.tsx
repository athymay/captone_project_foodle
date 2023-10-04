import axios from 'axios';
import qs from 'qs';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  RecipeResponsePayload,
  EmptyFilter,
  FilterParams,
  FilterType,
  SortType,
} from './shared/types';

/**
 * feel free to add more stuff in here that you want to use as global variables
 * put them in Context.Provider's value prop
 *
 * see Sidebar.tsx / Header.tsx / HomePage.jsx / NewRecipeForm.tsx for an
 * example of how to get the context variables
 */

interface AppContextValues {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  showSidebarTabOptions: boolean;
  setShowSidebarTabOptions: Dispatch<SetStateAction<boolean>>;
  recipes: RecipeResponsePayload[];
  setRecipes: Dispatch<SetStateAction<RecipeResponsePayload[]>>;
  CategoryIngredients: CategoryIngredientsType;
  pantry: CategoryIngredientsType[];
  setPantry: Dispatch<SetStateAction<CategoryIngredientsType[]>>;
  myLists: Record<string, string[]>;
  setMyLists: Dispatch<SetStateAction<Record<string, string[]>>>;
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  recipeFetchInProgress: boolean;
  setRecipeFetchInProgress: Dispatch<SetStateAction<boolean>>;
  sort: SortType;
  setSort: Dispatch<SetStateAction<SortType>>;
  fetchMyPantry: () => Promise<void>;
  fetchLists: () => Promise<void>;
}

type CategoryIngredientsType = {
  categoryName: string;
  ingredients: string[];
}[];

export const AppContext = createContext({} as AppContextValues);

function AppProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [showSidebarTabOptions, setShowSidebarTabOptions] =
    useState<boolean>(true);

  const [recipes, setRecipes] = useState<RecipeResponsePayload[]>([]);
  const [filter, setFilter] = useState<FilterType>(EmptyFilter);
  const [sort, setSort] = useState<SortType>('Ratings: High to Low');
  const [recipeFetchInProgress, setRecipeFetchInProgress] = useState(false);

  // total list of ingredients
  const [CategoryIngredients, setCategoryIngredients] =
    useState<CategoryIngredientsType>([]);

  // my Pantry
  const [pantry, setPantry] = useState<CategoryIngredientsType[]>([]);
  // my lists
  const [myLists, setMyLists] = useState<Record<string, string[]>>({});

  const fetchUser = useCallback(async () => {
    if (token) {
      const response = await fetch(`/api/get/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setUsername(json as string);
      } else {
        console.error(json.detail);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
  }, [token]);

  const fetchCategoryIngredients = useCallback(async () => {
    const response = await fetch(`/api/ingredients`);
    const json = await response.json();
    const parsedCategories = JSON.parse(json) as {
      categories: {
        categoryName: string;
        ingredients: string[];
      }[];
    };

    setCategoryIngredients(parsedCategories.categories);
  }, []);

  const fetchMyPantry = useCallback(async () => {
    if (token) {
      const response = await fetch(`/api/user/myingredients`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ingredients = await response.json();
      var dict = JSON.parse(ingredients);
      var array = dict.categories;
      setPantry(array);
    }
  }, [token]);

  const fetchLists = useCallback(async () => {
    if (token) {
      const response = await fetch(`/api/user/myLists`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      var lists = JSON.parse(res);
      var newLists: { [key: string]: string[] } = {};
      lists.forEach((val: { name: string | number; recipes: any }) => {
        newLists[val.name] = val.recipes;
      });
      setMyLists(newLists);
    }
  }, [token]);

  const fetchRecipes = useCallback(async () => {
    setRecipeFetchInProgress(true);

    const { ExcludeIngredients, Diet, MealType, Servings, Time } = filter;

    const exclude = ExcludeIngredients.map((e) => e.name);

    const sortBy = sort.includes('Ratings') ? 'rating' : 'time';
    const order = sort.includes('Low to High') ? 'low' : 'high';

    const filterParams: FilterParams = {
      user_name: username === '' ? undefined : username,
      diet: Diet.length === 0 ? undefined : Diet,
      exclude: exclude.length === 0 ? undefined : exclude,
      meal_type: MealType === '' ? undefined : MealType,
      num_servings: Servings,
      time: Time,
      sort: sortBy,
      order,
    };

    axios
      .get(`/api/myingredients/search`, {
        params: filterParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const recipe = response.data;

          var array = JSON.parse(recipe);
          setRecipes(array);
        }
      })
      .catch((err) => {
        console.error('Error: ' + JSON.stringify(err.response.data));
      })
      .finally(() => {
        setRecipeFetchInProgress(false);
      });
  }, [filter, sort, username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchCategoryIngredients();
  }, [fetchCategoryIngredients]);

  useEffect(() => {
    fetchMyPantry();
  }, [fetchMyPantry]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes, pantry]);

  return (
    <AppContext.Provider
      value={{
        username,
        setUsername,
        showSidebarTabOptions,
        setShowSidebarTabOptions,
        token,
        setToken,
        recipes,
        setRecipes,
        CategoryIngredients,
        pantry,
        setPantry,
        myLists,
        setMyLists,
        filter,
        setFilter,
        recipeFetchInProgress,
        setRecipeFetchInProgress,
        sort,
        setSort,
        fetchMyPantry,
        fetchLists,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export default AppProvider;

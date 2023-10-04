import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import RecipePage from './pages/RecipePage';
import Lists from './pages/ListsPage/Lists.jsx'
import StoreProvider from './Store';
import HomePage from './pages/homepage/HomePage';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPass1 from './pages/auth/ForgotPass1.jsx';
import ForgotPass2 from './pages/auth/ForgotPass2.jsx';
import Calendar from './pages/CalendarPage'
import AppProvider from './AppContext';
import RecipeFormProvider from './pages/new-recipe-form/RecipeFormContext';
import NewRecipe from './pages/new-recipe-form/NewRecipeFormContainer';
import Account from './pages/account/Account';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3BB927',
      contrastText: '#fff',
    },
    secondary: {
      main: '#484848',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: 'Outfit, sans-serif',
  },
});

export default function App() {
  return (
    <AppProvider>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <RecipeFormProvider>
            <Router>
              <div className="main">
                <Sidebar />
                <div className="main-page-contents">
                  <Header />
                  <div className="main-page-body">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route
                        path="/full-recipe/:recipeId"
                        element={<RecipePage />}
                      />
                      <Route path="/lists" element={<Lists />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot/1" element={<ForgotPass1 />} />
                      <Route path="/forgot/2" element={<ForgotPass2 />} />
                      <Route path="/new-recipe" element={<NewRecipe />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/account" element={<Account />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </Router>
          </RecipeFormProvider>
        </ThemeProvider>
      </StoreProvider>
    </AppProvider>
  );
}

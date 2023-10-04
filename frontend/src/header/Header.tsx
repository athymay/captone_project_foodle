import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import NewRecipeButton from '../pages/new-recipe-form/NewRecipeButton';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { username, setShowSidebarTabOptions } = useContext(AppContext);

  return (
    <header className="foodle-header">
      <div
        id="logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        Foodle
      </div>
      <div id="right-header-buttons">
        {username !== '' && (
          <>
            {location.pathname !== '/new-recipe' && <NewRecipeButton />}
            <div id="bell-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-bell"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
              </svg>
            </div>
          </>
        )}
        <div
          id="account-button"
          onClick={
            username === ''
              ? () => {
                  setShowSidebarTabOptions(false);
                  navigate('/login');
                }
              : () => {
                  setShowSidebarTabOptions(false);
                  navigate('/account');
                }
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            fill="currentColor"
            className="bi bi-person"
            viewBox="0 0 16 16"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
          </svg>
        </div>
      </div>
    </header>
  );
}

export default Header;

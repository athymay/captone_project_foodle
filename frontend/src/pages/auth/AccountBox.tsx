import { useContext } from 'react';
import './auth.css';
import { AppContext } from '../../AppContext';
import PromptLogin from './PromptLogin';

import { Button } from '@mui/material';

function AccountBox() {
  const { token, setToken } = useContext(AppContext);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <>
      <div id="accountBox" className="accountbox">
        {
          token === null
          ? <PromptLogin/>
          : <Button onClick={handleLogout}> Logout </Button>
        }
      </div>
    </>
  );
}

export default AccountBox;

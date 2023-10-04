import React from 'react';
import './auth.css';
import '../../App.css'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext'

export default function PromptLogin() {

  const { setShowSidebarTabOptions } = React.useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    setShowSidebarTabOptions(true);
    navigate('/login');
  }

  return (
    <>
      <form className="promptLoginBox">
        <div>Please login to see your account details!</div>
        <br/>
        <div
          id="prompt-login"
          className="button-outline"
          onClick={handleClick}
        >
          <div className="btn-text">Head to Login / Register</div>
        </div>
      </form>
    </>
  );
}

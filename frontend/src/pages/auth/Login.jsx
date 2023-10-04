import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Link,
} from '@mui/material';
import { AppContext } from '../../AppContext';

export default function LoginPage() {
  const { setShowSidebarTabOptions, setToken } = React.useContext(AppContext);
  const [uName, setUName] = React.useState('');
  const [pWord, setPword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  React.useEffect(() => {
    setShowSidebarTabOptions(false);
  }, [setShowSidebarTabOptions]);

  const navigate = useNavigate();

  const handleUNameChange = (e) => {
    setUName(e.target.value);
  };
  const handlePWordChange = (e) => {
    setPword(e.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    setErrorMsg('');
    if (evt) {
      evt.preventDefault();
    }
    if (uName === '' || pWord === '') {
      setErrorMsg('There are empty fields, please try again.');
    } else {
      let data = new FormData();
      data.append('username', uName);
      data.append('password', pWord);
      const news = async () => {
        let res = await axios
          .post('/api/login', data)
          .then((response) => {
            localStorage.setItem('token', response.data.access_token);
            setToken(response.data.access_token);
            return response;
          })
          .catch((error) => {
            console.error(error);
            setErrorMsg(error.response.data.detail);
          });
        return res;
      };
      let x = await news();
      if (x) {
        setSuccessMsg('Log in success.');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    }
  };

  return (
    <>
      <form className="formContainer">
        <h1>Login</h1>
        <div className="ErrorTxt">{errorMsg}</div>
        <div className="SuccessTxt">{successMsg}</div>
        <FormControl
          sx={{
            ".MuiFormHelperText-root": {
              color: '#484848',
              fontFamily: "'Outfit', sans-serif",
            },
            ".MuiFormLabel-root": {
              fontFamily: "'Outfit', sans-serif",
            }
          }}
        >
          <InputLabel htmlFor="my-uName">Username</InputLabel>
          <Input
            id="my-uName"
            aria-describedby="my-helper-uName"
            onChange={handleUNameChange}
            required={true}
          />
          <FormHelperText id="my-helper-uName" className="inputContainer">
            Please put in your username
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            ".MuiFormHelperText-root": {
              color: '#484848',
              fontFamily: "'Outfit', sans-serif",
            },
            ".MuiFormLabel-root": {
              fontFamily: "'Outfit', sans-serif",
            }
          }}
        >
          <InputLabel htmlFor="my-pass">Password</InputLabel>
          <Input
            id="my-pass"
            type="password"
            aria-describedby="my-helper-pass"
            onChange={handlePWordChange}
            required={true}
          />
          <FormHelperText id="my-helper-pass" className="inputContainer">
            Please put in your password
          </FormHelperText>
        </FormControl>
        <Button className='auth-button' onClick={handleSubmit} variant="contained" style={{fontFamily: "'Outfit', sans-serif"}}> Login</Button>
        <div className="link" style={{marginTop: '20px'}} onClick={() => navigate('/register')}>
            <Link underline="hover">No Account? Register now!</Link>
        </div>
        <div className="link" onClick={() => navigate('/forgot/1')}>
            <Link underline="hover">Forgot password? Reset here!</Link>
        </div>
      </form>
    </ >
  );
}

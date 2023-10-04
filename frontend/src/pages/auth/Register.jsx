import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import { AppContext } from '../../AppContext';


import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Link,
} from '@mui/material';

export default function RegisterPage() {
  const [email, setEmail] = React.useState('');
  const [confEmail, setconfEmail] = React.useState('');
  const [uName, setUName] = React.useState('');
  const [pWord, setPword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const { setToken } = React.useContext(AppContext);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleConfEmailChange = (e) => {
    setconfEmail(e.target.value);
  };
  const handlePWordChange = (e) => {
    setPword(e.target.value);
  };
  const handleUNameChange = (e) => {
    setUName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (email === '' || confEmail === '' || uName === '' || pWord === '') {
      setErrorMsg('There are empty fields, please try again.');
    } else if (email !== confEmail) {
      setErrorMsg('Emails are not the same, please try again.');
    } else {
      fetchRegister();
    }
  };

  const fetchRegister = React.useCallback(async () => {
    const req = JSON.stringify({
      user_name: uName,
      email: email,
      password: pWord,
    });
    const response = await fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: req,
    });
    const res = await response.json();
    if (res.message === 'created') {
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
        setSuccessMsg('Register success. Logging in.');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } else {
      setErrorMsg(res.message);
    }
  }, [email, navigate, pWord, setToken, uName]);

  return (
    <>
      <form className="formContainer">
        <h1>Register</h1>
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
          <InputLabel htmlFor="my-email">Email address</InputLabel>
          <Input
            id="my-email"
            aria-describedby="my-helper-email"
            onChange={handleEmailChange}
            required={true}
          />
          <FormHelperText id="my-helper-email" className="inputContainer">
            Please put in your email
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
          <InputLabel htmlFor="my-confemail">Confirm Email address</InputLabel>
          <Input
            id="my-confemail"
            aria-describedby="my-helper-confemail"
            onChange={handleConfEmailChange}
            required={true}
          />
          <FormHelperText id="my-helper-confemail" className="inputContainer">
            Please confirm your email
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
          <InputLabel htmlFor="my-uNmae">Username</InputLabel>
          <Input
            id="my-uNmae"
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
        <Button className='auth-button' onClick={handleSubmit} variant="contained" style={{fontFamily: "'Outfit', sans-serif"}}>Register</Button>
        <div className="link" onClick={() => navigate('/login')}>
          <Link underline="hover">Already have an account? Login now!</Link>
        </div>
      </form>
    </>
  );
}

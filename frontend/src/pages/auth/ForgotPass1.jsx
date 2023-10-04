import React from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
} from '@mui/material';

export default function ForgotPass1() {
  const [email, setEmail] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg('');
    if (email === '') {
      setErrorMsg('There are empty fields, please try again.');
    } else {
      fetchForgot();
    }
  };

  const fetchForgot = React.useCallback(async () => {
    const url = `/api/forgotpassword/request?email=${email}`;
    const response = await fetch(url, {
      method: 'POST',
    });
    const res = await response.json();
    if (res.message === 'success') {
      navigate('/forgot/2');
    } else {
      setErrorMsg(res.message);
    }
  }, [email, navigate]);

  return (
    <>
      <form className="formContainer">
        <h1>Forgot Password</h1>
        <div className="ErrorTxt">{errorMsg}</div>
        <FormControl>
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
        <Button onClick={handleSubmit} variant="contained" >Submit</Button>
      </form>
    </>
  );
}

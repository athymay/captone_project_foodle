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
  const [code, setCode] = React.useState('');
  const [pWord, setPword] = React.useState('');

  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handlePWordChange = (e) => {
    setPword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg('');
    if (code === '' || pWord === '') {
      setErrorMsg('There are empty fields, please try again.');
    } else {
      fetchForgot();
    }
  };

  const fetchForgot = React.useCallback(async () => {
    const req = JSON.stringify({
      code: code,
      new_password: pWord,
    });
    const response = await fetch(`/api/forgotpassword/reset`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: req,
    });
    const res = await response.json();
    if (res.message === 'Password reset, please try login again') {
      setSuccessMsg(
        'Password reset, please try to login again. Redirecting to login.'
      );
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  }, [code, navigate, pWord]);

  return (
    <>
      <form className="formContainer">
        <h1>Forgot Password</h1>
        <div>Please check your code for a reset code.</div>
        <div className="ErrorTxt">{errorMsg}</div>
        <div className="SuccessTxt">{successMsg}</div>
        <FormControl>
          <InputLabel htmlFor="my-code">Code</InputLabel>
          <Input
            id="my-code"
            aria-describedby="my-helper-code"
            onChange={handleCodeChange}
            required={true}
          />
          <FormHelperText id="my-helper-code" className="inputContainer">
            Please put in your code
          </FormHelperText>
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="my-pass">Password</InputLabel>
          <Input
            id="my-pass"
            type="password"
            aria-describedby="my-helper-pass"
            onChange={handlePWordChange}
            required={true}
          />
          <FormHelperText id="my-helper-pass" className="inputContainer">
            Please put in your new password
          </FormHelperText>
        </FormControl>

        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </form>
    </>
  );
}

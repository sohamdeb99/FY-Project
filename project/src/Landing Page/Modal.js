import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './App.css'; // Ensure the path is correct for your project structure

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Modal({ isVisible, closeModal, setIsLoggedIn, setUsername }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [passwordError, setPasswordError] = useState('');

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setPasswordError('');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      const username = document.getElementById('usernameInput').value;
      const email = document.getElementById('emailInput').value;
      const password = document.getElementById('passwordInput').value;
      const repeatPassword = document.getElementById('repeatPasswordInput').value;

      if (!username || !email || !password || !repeatPassword) {
        setSnackbarMessage('All fields are required');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      if (!validateEmail(email)) {
        setSnackbarMessage('Invalid email format');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      if (password !== repeatPassword) {
        setPasswordError('Passwords do not match');
        return;
      }

      // Registration API call
      try {
        const response = await fetch('http://localhost:3001/Auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();

        if (response.status === 200) {
          setSnackbarMessage(data.message || 'Registration successful!');
          setSnackbarType('success');
          setIsSignUp(false); // Switch to login after successful registration
        } else {
          setSnackbarMessage(data.message || 'Registration failed');
          setSnackbarType('error');
        }
      } catch (error) {
        setSnackbarMessage('Registration request failed');
        setSnackbarType('error');
      }
    } else {
      const identifier = document.getElementById('loginInput').value;
      const password = document.getElementById('passwordInput').value;

      if (!identifier || !password) {
        setSnackbarMessage('Username/Email and Password are required');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      // Login API call
      try {
        const response = await fetch('http://localhost:3001/Auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifier, password }),
        });
        const data = await response.json();

        if (response.status === 200) {
          localStorage.setItem('token', data.token);
          setIsLoggedIn(true);
          setUsername(data.username);
          closeModal();
        } else {
          setSnackbarMessage(data.message || 'Login failed');
          setSnackbarType('error');
        }
      } catch (error) {
        setSnackbarMessage('Login request failed');
        setSnackbarType('error');
      }
    }

    setSnackbarOpen(true);
  };

  return (
    <div id="modal" className={`modal ${isVisible ? 'show' : ''}`} onClick={closeModal}>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarType} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <form className="modal-content" onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()}>
        <span className="close" title="Close Modal" onClick={closeModal}>&times;</span>
        <h1 id="formTitle">{isSignUp ? 'Sign Up' : 'Login'}</h1>
        {isSignUp ? (
          <>
            <label htmlFor="usernameInput"><b>Username</b></label>
            <input id="usernameInput" type="text" placeholder="Enter Username" name="username" required />
            <label htmlFor="emailInput"><b>Email</b></label>
            <input id="emailInput" type="text" placeholder="Enter Email" name="email" required />
            <label htmlFor="passwordInput"><b>Password</b></label>
            <input id="passwordInput" type="password" placeholder="Enter Password" name="password" required />
            <label htmlFor="repeatPasswordInput"><b>Repeat Password</b></label>
            <input id="repeatPasswordInput" type="password" placeholder="Repeat Password" name="repeatPassword" required />
            {passwordError && <div style={{ color: 'red', marginTop: '10px' }}>{passwordError}</div>}
          </>
        ) : (
          <>
            <label htmlFor="loginInput"><b>Username or Email</b></label>
            <input id="loginInput" type="text" placeholder="Enter Username or Email" name="identifier" required />
            <label htmlFor="passwordInput"><b>Password</b></label>
            <input id="passwordInput" type="password" placeholder="Enter Password" name="password" required />
          </>
        )}
        {!isSignUp && <a href="#" className="forgot-password" id="forgotPassword">Forgotten password?</a>}
        <button type="submit" id="submitBtn">{isSignUp ? 'Sign Up' : 'Login'}</button>
        <div className="toggle-section">
          {!isSignUp ? (
            <span id="toggleSignup" onClick={toggleForm}>Don't have an account? Sign Up</span>
          ) : (
            <span id="toggleLogin" onClick={toggleForm}>Already have an account? Login</span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Modal;

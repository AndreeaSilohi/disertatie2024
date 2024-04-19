import React, { useContext, useReducer, useState, useEffect } from 'react';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import './ProfileScreen.css';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};
export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [notification, setNotification] = useState(null);
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  // useEffect(() => {
  //   setName(userInfo.name);
  //   setEmail(userInfo.email);
  // }, [userInfo]);
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/users/edit/${userInfo._id}`,
        {
          name,
          email,
          password,
        },
        config
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setNotification('Informațiile au fost actualizate cu succes');
      setTimeout(() => {
        setNotification(null);
        // navigate('/contact');
      }, 3000);
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL' });
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="general-div">
      <div className="container-profile-screen">
        {/* <div className="div-profile-img">
          <img
            className="profile-image"
            alt="text"
            src="https://images.unsplash.com/photo-1628407252041-9304159534a5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          ></img>
        </div> */}
        <div className="form-profile">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '40px',
              maxWidth: 600,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',
                p: 2,
                border: '1px solid  #0000004e',
                borderRadius: '12px',
                boxShadow: 1,
              }}
            >
              <Typography
                variant="h5"
                align="center"
                mb={2}
                className="typografy"
              >
                Actualizare date personale
              </Typography>
              <form onSubmit={submitHandler} className="form-content-profile">
                <TextField
                  style={{ marginBottom: '35px', width: '70%' }}
                  label="Nume"
                  variant="outlined"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  style={{ marginBottom: '35px', width: '70%' }}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  style={{ marginBottom: '35px', width: '70%' }}
                  label="Parolă"
                  variant="outlined"
                  type="password"
                  fullWidth
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                  style={{ marginBottom: '35px', width: '70%' }}
                  label="Confirmă parolă"
                  variant="outlined"
                  type="password"
                  fullWidth
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="form-shipping-content-button">
                  <Button
                    variant="contained"
                    className="button-actulizare"
                    type="submit"
                    style={{
                      backgroundColor: '#F08000',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '15px',
                      width: '200px',
                    }}
                  >
                    Actualizare
                  </Button>
                </div>
              </form>
            </Box>
          </Box>
          {notification && <div className="notification">{notification}</div>}
        </div>
      </div>
    </div>
  );
}

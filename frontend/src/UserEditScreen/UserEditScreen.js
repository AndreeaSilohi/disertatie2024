import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import { Button, TextField, Typography, Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './UserEditScreen.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, openToast: true };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function UserEditScreen({ userId, onClose, updateUserList }) {
  // const [openToast, setOpenToast] = useState(false);
  // const [toastMessage, setToastMessage] = useState('');
  // const [toastSeverity, setToastSeverity] = useState('success');

  const handleToastCloseUser = () => {
    dispatch({ type: 'UPDATE_SUCCESS' }); // Close Snackbar when the user closes it.
  };
  const [{ loading, error, loadingUpdate, openToast }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
      openToast: false,
    }
  );

  const { state } = useContext(Store);
  const { userInfo } = state;

  // const params = useParams();
  // const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/users/${userId}`,
        {
          _id: userId,
          name,
          email,
          isAdmin,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'UPDATE_SUCCESS' });

      updateUserList();
      onClose();
      navigate('/admin/users');
    } catch (error) {
      window.alert(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <div className="edit-screen-user-container">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="user-edit-form">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '40px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxWidth: 800,
                  mx: 'auto',
                  p: 2,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  mb={2}
                  className="typography-title"
                  sx={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Editare informații utilizator
                </Typography>
                <form onSubmit={submitHandler}>
                  <TextField
                    fullWidth
                    margin="normal"
                    className="input-field"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    className="input-field"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="checkbox-container">
                    <label className="checkbox-label" htmlFor="isAdminCheckbox">
                      Este administrator
                    </label>
                    <input
                      type="checkbox"
                      margin="normal"
                      name="isAdmin"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      id="isAdminCheckbox"
                    />
                  </div>
                  <div className="button-submit">
                    <Button
                      disabled={loadingUpdate}
                      fullWidth
                      type="submit"
                      sx={{
                        mt: 2,
                        backgroundColor: '#064420',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#52616B',
                        },
                      }}
                    >
                      {loading ? 'Sending...' : 'Actualizare'}
                    </Button>
                  </div>
                  {loadingUpdate && <LoadingBox></LoadingBox>}
                </form>
              </Box>
              <Snackbar
                open={openToast} // Open Snackbar based on openToast state.
                autoHideDuration={6000}
                onClose={handleToastCloseUser}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={handleToastCloseUser}
                  severity="success" // Set the severity to success for successful updates.
                >
                  User updated successfully
                </MuiAlert>
              </Snackbar>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
}

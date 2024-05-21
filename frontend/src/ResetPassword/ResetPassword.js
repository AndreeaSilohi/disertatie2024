import React from 'react';
import { useState,useEffect,useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { Button } from '@mui/material';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();

  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [notification, setNotification] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // window.alert('Parolele nu se potrivesc');
      setNotification({
        type: 'warning',
        message: 'Parolele nu se potrivesc',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }

    try {
      await axios.post('/api/users/reset-password', {
        password,
        token,
      });
      navigate('/signin');
      window.alert('Parola schimbata cu succes!');
    } catch (err) {
      window.alert(getError(err));
    }
  };

  
  useEffect(() => {
    if (userInfo || !token) {
      navigate('/');
    }
  }, [navigate, userInfo, token]);

  return (
    <div className="background">
      <div className="container">
        <div className="forms">
        <input type="checkbox" id="flip" />
          <div className="cover">
            <div className="front">
              <img
                src="https://images.pexels.com/photos/60579/forget-me-not-hoverfly-fly-flower-60579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Resetare parolă"
              />
            </div>
          </div>
          <div className="form-content">
            <div className="reset-form">
              <div className="title-reset">Resetează parola</div>
              <form onSubmit={submitHandler} action="#">
                <div className="input-boxes-reset">
                  <div className="input-box">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Introdu parola nouă"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{padding:"0px"}}
                    />
                  </div>

                  <div className="input-box">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Confirmă parola nouă"
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      sx={{padding:"0px"}}
                    />
                  </div>
                  {/* <Button type="submit">Resetează parola</Button> */}
                  <div className="button-reset input-box">
                      <input type="submit" value="Trimite" />
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          {/* <button onClick={handleCloseNotification}>Close</button> */}
        </div>
      )}
    </div>
  );
}

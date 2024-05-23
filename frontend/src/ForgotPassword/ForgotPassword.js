import React from 'react';
import { useContext, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { Button } from '@mui/material';
import './ForgotPassword.css';
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/users/forget-password', {
        email,
      });
      setNotification('Un mail de resetare a parolei a fost trimis!');
      setTimeout(() => {
        setNotification(null);
      }, 2000);
      
    } catch (err) {
      window.alert(getError(err));
    }
  };
  return (
    <div className="background">
      <div className="container">
      {/* <input type="checkbox" id="flip" /> */}
          <div className="cover">
            <div className="front">
              <img
                src="https://images.unsplash.com/photo-1511977688910-65315e4a57ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Parolă uitată"
              />
            </div>
          </div>
        <div className="forms">
          <div className="form-content">
            <div className="forgot-form">
              <div className="title-logare">Ai uitat parola?</div>
              <form onSubmit={submitHandler} action="#">
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="Introdu email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {/* <Button type="submit">Trimite</Button> */}
                  <div className="button-forgot input-box">
                      <input type="submit" value="Trimite" />
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

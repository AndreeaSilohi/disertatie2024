import React from 'react';
import { useState,useEffect,useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { Button } from '@mui/material';

export default function ResetPassword() {
  const navigate = useNavigate();

  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state } = useContext(Store);
  const { userInfo } = state;



  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      window.alert('Parolele nu se potrivesc');
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
          <div className="form-content">
            <div className="login-form">
              <div className="title">Reset password</div>
              <form onSubmit={submitHandler} action="#">
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="input-box">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Reset Password</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

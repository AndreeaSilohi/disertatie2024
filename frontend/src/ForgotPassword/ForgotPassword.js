import React from 'react';
import { useContext, useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { Button } from '@mui/material';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { state } = useContext(Store);
  const { userInfo } = state;

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
      window.alert(data.message);
    } catch (err) {
      window.alert(getError(err));
    }
  };
  return (
    <div className="background">
      <div className="container">
        <div className="forms">
          <div className="form-content">
            <div className="login-form">
              <div className="title">Forgot password</div>
              <form onSubmit={submitHandler} action="#">
                <div className="input-boxes">
                  <div className="input-box">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { Eye } from 'phosphor-react';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();

  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [notification, setNotification] = useState(null);
  const [notificationWarning, setNotificationWarning] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setNotificationWarning('Parolele nu se potrivesc');
      setTimeout(() => {
        setNotificationWarning(null);
      }, 2000);
      return;
    }

    try {
      await axios.post('/api/users/reset-password', {
        password,
        token,
      });

      setNotification('Parola a fost schimbată cu succes!');
      setTimeout(() => {
        setNotification(null);
        navigate('/signin');
      }, 2000);
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
                  <div className="inputs-reset">
                    <div className="input-box">
                      <div className="password-input">
                        <i className="fas fa-lock"></i>

                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Introdu parola nouă"
                          required
                          onChange={(e) => setPassword(e.target.value)}
                          sx={{ padding: '0px' }}
                        />
                        <Eye
                          size={26}
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            cursor: 'pointer',
                            color: showPassword ? '#FFA500' : 'green',
                          }}
                        />
                      </div>
                    </div>

                    <div className="input-box">
                      <div className="password-input">
                        <i className="fas fa-lock"></i>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirmă parola nouă"
                          required
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          sx={{ padding: '0px' }}
                        />
                        <Eye
                          size={26}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={{
                            cursor: 'pointer',
                            color: showConfirmPassword ? '#FFA500' : 'green',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="button-reset input-box"
                  style={{ marginTop: '20px' }}
                >
                  <input type="submit" value="Trimite" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {notification && <div className="notification">{notification}</div>}
      {notificationWarning && (
        <div className="notificationWarning">{notificationWarning}</div>
      )}
    </div>
  );
}

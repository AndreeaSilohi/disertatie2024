import React, { useEffect, useState } from 'react';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import './ShippingAddress.css';
import { Store } from '../Store';
import { useContext } from 'react';
import CheckoutSteps from '../CheckoutSteps/CheckoutSteps';
import backgroundNew from '../assets/backgroundNew.png';

export default function ShippingAddress() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [telephone, setTelephone] = useState(shippingAddress.telephone || '');

  const [notificationWarning, setNotificationWarning] = useState('');
  const [telephoneError, setTelephoneError] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        telephone,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        telephone,
      })
    );
    navigate('/payment');
  };

  // const handleTelephoneChange = (e) => {
  //   const { value } = e.target;
  //   if (/^\d*$/.test(value)) {
  //     setTelephone(value);
  //     setTelephoneError(''); // Clear any previous error
  //   } else {
  //     setTelephoneError('Pentru acest câmp poți introduce doar cifre');
  //   }
  // };

  const handleTelephoneChange = (e) => {
    const { value } = e.target;

    if (/^\d*$/.test(value)) {
      setTelephone(value);

      if (value.length === 10) {
        setTelephoneError('');
      } else {
        setTelephoneError('Numărul de telefon trebuie să aibă exact 10 cifre');
      }
    } else {
      setTelephoneError('Pentru acest câmp poți introduce doar cifre');
    }
  };

  const handlePostalCodeChange = (e) => {
    const { value } = e.target;
  
    if (/^\d*$/.test(value)) {
   
      setPostalCode(value);
  
      if (value.length === 6) {
        setPostalCodeError(''); 
      } else {
        setPostalCodeError('Codul poștal trebuie să aibă exact 6 cifre!');
      }
    } else {
      setPostalCodeError('Pentru acest câmp poți introduce doar cifre');
    }
  };
  
  // const handlePostalCodeChange = (e) => {
  //   const { value } = e.target;
  //   if (/^\d*$/.test(value) && value.length <= 6) {
  //     setPostalCode(value);
  //     setPostalCodeError(''); // Clear any previous error
  //   } else if (value.length > 6) {
  //     setPostalCodeError('Codul poștal trebuie să aibă 6 cifre!');
  //   } else {
  //     setPostalCodeError('Pentru acest câmp poți introduce doar cifre');
  //   }
  // };

  return (
    <div className="total">
      <div className="checkout-steps-shipping">
        <CheckoutSteps step1 step2></CheckoutSteps>
      </div>
      <div className="form-shipping">
        <div className="left">
          <img className="left-img" src={backgroundNew}></img>
        </div>
        <form onSubmit={submitHandler}>
          <FormLabel
            sx={{ fontSize: '35px', padding: '40px 40px 40px 0px' }}
            id="demo-controlled-radio-buttons-group"
            className="form-label"
          >
            Adresă livrare
          </FormLabel>
          <TextField
            label="Nume Complet"
            margin="normal"
            fullWidth
            required
            value={fullName}
            sx={{ width: '650px' }}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextField
            label="Adresă completă"
            margin="normal"
            fullWidth
            required
            value={address}
            sx={{ width: '650px' }}
            onChange={(e) => setAddress(e.target.value)}
          />

          <TextField
            label="Județ"
            margin="normal"
            fullWidth
            required
            value={city}
            sx={{ width: '650px' }}
            onChange={(e) => setCity(e.target.value)}
          />

          {/* <TextField
            label="Cod poștal"
            margin="normal"
            fullWidth
            required
            value={postalCode}
            sx={{ width: '650px' }}
            onChange={(e) => setPostalCode(e.target.value)}
          /> */}

          <TextField
            label="Cod poștal"
            margin="normal"
            fullWidth
            required
            value={postalCode}
            sx={{ width: '650px' }}
            onChange={handlePostalCodeChange}
            error={!!postalCodeError}
            helperText={postalCodeError}
          />
          <TextField
            label="Țara"
            margin="normal"
            fullWidth
            required
            value={country}
            sx={{ width: '650px' }}
            onChange={(e) => setCountry(e.target.value)}
          />

          {/* <TextField
            label="Telefon"
            margin="normal"
            fullWidth
            required
            value={telephone}
            sx={{ width: '650px' }}
            onChange={handleTelephoneChange}
          /> */}

          <TextField
            label="Telefon"
            margin="normal"
            fullWidth
            required
            value={telephone}
            sx={{ width: '650px' }}
            onChange={handleTelephoneChange}
            error={!!telephoneError}
            helperText={telephoneError}
          />
          <div className="div-button-continue">
            <button className="button-continue">Continuă</button>
          </div>
        </form>
        {notificationWarning && (
          <div className="notificationWarning">{notificationWarning}</div>
        )}
      </div>
    </div>
  );
}

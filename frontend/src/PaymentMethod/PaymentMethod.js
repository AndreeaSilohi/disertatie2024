import React, { useContext, useEffect } from 'react';
import CheckoutSteps from '../CheckoutSteps/CheckoutSteps';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import './PaymentMethod.css';
import albine from '../assets/albine.png';
import backgroundNew from '../assets/backgroundNew.png';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = React.useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  const handleChange = (event) => {
    setPaymentMethodName(event.target.value);
  };
  return (
    <div className="container-payment">
      <div className="checkout-steps-payment">
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
      </div>

      <div className="form-payment-method">
        <div className="left">
          <img className="left-img-payment" src={backgroundNew}></img>
        </div>
        <form onSubmit={submitHandler}>
          <div className="form-controls">
            <FormControl>
              <FormLabel
                sx={{ fontSize: '35px' }}
                id="demo-controlled-radio-buttons-group"
                className="form-label"
              >
                Metodă de plată
              </FormLabel>

              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={paymentMethodName}
                onChange={handleChange}
              >
                <FormControlLabel
                  style={{ fontSize: '35px' }}
                  value="PayPal"
                  control={<Radio />}
                  label="PayPal"
                />
                <FormControlLabel
                  sx={{ fontSize: '35px' }}
                  value="Cash"
                  control={<Radio />}
                  label="Cash la livrare"
                />
              </RadioGroup>
              <button className="button-continue-payment">Continuă</button>
            </FormControl>
          </div>
        </form>
      </div>
    </div>
  );
}

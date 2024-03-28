import React, { useContext, useEffect } from "react";
import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import "./PaymentMethod.css";
import miere from "../assets/miere.png";

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

 
  const [paymentMethodName, setPaymentMethodName] = React.useState(
    paymentMethod || "PayPal"
  );//To have selected payPal by default the "PayPal"should be the same with the value of PayPal

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

 

  // const submitHandler = (e) => { //mine
  //   e.preventDefault();
  //   ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
  //   localStorage.setItem("paymentMethod", paymentMethodName);
  //   navigate("/placeorder");
  // };

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
      <div className="img-background">
        <div className="navbar-payment">
          <Navbar />
        </div>
        <div className="total">
          <div className="left">
            <img className="left-img" src={miere}></img>
          </div>
          <div className="form-content">
            <form className="mat-form" onSubmit={submitHandler}>
              <h1 className="text-center">Payment Method</h1>
              <div className="checkout">
                <CheckoutSteps step1 step2 step3></CheckoutSteps>
              </div>
              <div className="form-payment-fields">
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Payment Method
                  </FormLabel>

                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={paymentMethodName}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="PayPal"
                      control={<Radio />}
                      label="PayPal"
                    />
                    <FormControlLabel
                      value="Stripe"
                      control={<Radio />}
                      label="Stripe"
                    />
                  </RadioGroup>
                  <button className="button-continue">Continue</button>
                </FormControl>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

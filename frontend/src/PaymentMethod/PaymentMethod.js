import React, { useCallback, useContext, useEffect } from "react";
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

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  const [paymentMethodName, setPaymentMethodName] = React.useState(
    paymentMethod || "PayPal"
  );

  const handleChange = (event) => {
    setPaymentMethodName(event.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethod);
    navigate("/placeorder");
  };
  return (
    <div className="container-payment">
      <div className="navbar-payment">
        <Navbar />
      </div>
      <div className="form-content">
        <form className="mat-form" onSubmit={submitHandler}>
          <h1 className="text-center">Payment Method</h1>
          <div className="checkout">
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
          </div>
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
                value="paypal"
                control={<Radio />}
                label="PayPal"
              />
              <FormControlLabel
                value="stripe"
                control={<Radio />}
                label="Stripe"
              />
            </RadioGroup>
          </FormControl>

          <div style={{ padding: "20px" }}>
            <Button
              variant="contained"
              className="continue"
              type="submit"
              style={{ backgroundColor: "#D77E2B" }}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

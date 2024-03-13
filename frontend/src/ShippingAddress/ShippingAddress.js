import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import "./ShippingAddress.css";
import { Store } from "../Store";
import { useContext } from "react";

import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";

export default function ShippingAddress() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate("/payment");
  };

  return (
    <div className="container-shipping">
      <div className="image-background">
        <div className="navbar-shipping">
          <Navbar />
        </div>
        <div className="form-shipping">
          <form onSubmit={submitHandler}>
            <div className="background-picture">
              <div className="form-shipping-content">
                <h1 className="text-center">
                  <p>Shipping Address</p>
                </h1>
                <div className="left-border"></div>
                <div className="checkout">
                  <CheckoutSteps step1 step2></CheckoutSteps>
                </div>
                <div className="form-shipping-fields">
                  <TextField
                    style={{ marginBottom: "35px", width: "70%" }}
                    label="Full name"
                    variant="standard"
                    fullWidth
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <TextField
                    style={{ marginBottom: "35px", width: "70%" }}
                    label="Address"
                    variant="standard"
                    fullWidth
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <TextField
                    style={{ marginBottom: "35px", width: "70%" }}
                    label="City"
                    variant="standard"
                    fullWidth
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />

                  <TextField
                    style={{ marginBottom: "35px", width: "70%" }}
                    label="Postal code"
                    variant="standard"
                    fullWidth
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />

                  <TextField
                    style={{ marginBottom: "35px", width: "70%" }}
                    label="Country"
                    variant="standard"
                    fullWidth
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />

                  {/* <div className="form-shipping-content-button">
                  <Button
                   className="button-subtotal"
                    variant="contained"
                    //className="continue"
                    type="submit"
                    // style={{
                    //   backgroundColor: "#F08000",
                    //   fontFamily: "Catamaran, sans-serif",
                    //   fontSize: "15px",
                    //   width: "200px",
                    // }}
                  >
                    Continue
                  </Button>
                </div> */}
                  <button className="button-continue">Continue</button>
                </div>
                <div className="right-border"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

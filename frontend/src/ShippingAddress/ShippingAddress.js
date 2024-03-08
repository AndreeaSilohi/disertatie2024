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
      <div className="navbar-shipping">
        <Navbar />
      </div>
      <div className="frame">
        
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#f08000"
              fill-opacity="0.5"
              d="M0,96L34.3,117.3C68.6,139,137,181,206,181.3C274.3,181,343,139,411,144C480,149,549,203,617,192C685.7,181,754,107,823,90.7C891.4,75,960,117,1029,117.3C1097.1,117,1166,75,1234,64C1302.9,53,1371,75,1406,85.3L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
            />
          </svg>
        

        <div className="form-shipping">
          <form onSubmit={submitHandler}>
            <h1 className="text-center">Shipping Address</h1>
            <div className="checkout">
              <CheckoutSteps step1 step2></CheckoutSteps>
            </div>
            <div className="background-picture">
              <div className="form-shipping-content">
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

                  <div className="form-shipping-content-button">
                    <Button
                      variant="contained"
                      className="continue"
                      type="submit"
                      style={{
                        backgroundColor: "#F08000",
                        fontFamily: "Catamaran, sans-serif",
                        fontSize: "15px",
                        width: "200px",
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#f08000"
              fill-opacity="0.5"
              d="M0,96L34.3,117.3C68.6,139,137,181,206,181.3C274.3,181,343,139,411,144C480,149,549,203,617,192C685.7,181,754,107,823,90.7C891.4,75,960,117,1029,117.3C1097.1,117,1166,75,1234,64C1302.9,53,1371,75,1406,85.3L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
              transform="rotate(90, 720, 160)"
            />
          </svg>
        
      </div>
    </div>
  );
}

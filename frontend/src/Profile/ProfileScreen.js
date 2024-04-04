import React, { useContext, useReducer, useState } from "react";
import { Store } from "../Store";
import Navbar from "../navbar/Navbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./ProfileScreen.css";
import { getError } from "../utils";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};
export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.put(`/api/users/edit/${userInfo._id}`, {
        name,
        email,
        password,
      }, config);
      
      ctxDispatch({ type: "USER_UPDATE_SUCCESS", payload: data });
      dispatch({ type: "UPDATE_SUCCESS" });
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      console.error("Error updating user:", error);
    }
  };
  

  return (
    <div className="container-profile-screen">
      {/* <div className="navbar-shipping">
        <Navbar />
      </div> */}

      <div className="form-profile">
        <form onSubmit={submitHandler}>
          <h1 className="text-center">User Profile</h1>
          <div className="form-shipping-content">
            <div className="form-shipping-fields">
              <TextField
                style={{ marginBottom: "35px", width: "70%" }}
                label="Name"
                variant="standard"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                style={{ marginBottom: "35px", width: "70%" }}
                label="Email"
                variant="standard"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                style={{ marginBottom: "35px", width: "70%" }}
                label="Password"
                variant="standard"
                type="password"
                fullWidth
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                style={{ marginBottom: "35px", width: "70%" }}
                label="Confirm password"
                variant="standard"
                type="password"
                fullWidth
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Update
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

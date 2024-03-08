import { useContext, useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../navbar/Navbar";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";

function SignUp() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandlerSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const { data } = await Axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="background">
        <div className="container">
          <input type="checkbox" id="flip" />
          <div className="cover">
            <div className="front">
              <img
                src="https://images.unsplash.com/photo-1497322313607-9fa0c2c4c4f8?q=80&w=1937&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
          </div>
          <div className="forms">
            <div className="form-content">
              <div className="signup-form">
                <div className="title">Signup</div>
                <form onSubmit={submitHandlerSignup} action="#">
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        required
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="text"
                        placeholder="Enter your email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
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
                        placeholder="Confirm password"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="button input-box">
                      <input type="submit" value="Submit" />
                    </div>
                    <div className="text sign-up-text">
                      Already have an account?{" "}
                      <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

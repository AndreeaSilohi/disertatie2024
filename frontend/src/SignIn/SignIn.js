import "./SignIn.css";
import { useContext, useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../navbar/Navbar";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Wishlist } from "../W";
import ResetPassword from "../ResetPassword/ResetPassword";
function Profile() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const { stateW, dispatch: ctxDispatchW } = useContext(Wishlist);
  const {
    wishlist: { wishlistItems },
  } = stateW;

  const fetchWishlistItems = async (token) => {
    try {
      const { data } = await Axios.get("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      ctxDispatchW({
        type: "WISHLIST_SET_ITEMS",
        payload: data.wishlistItems,
      });
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  const fetchcartItems = async (token) => {
    try {
      const { data } = await Axios.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      ctxDispatch({
        type: "CART_SET_ITEMS",
        payload: data.cartItems,
      });
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  const fetchCurrentUserById = async (userId, token) => {
    try {
      const response = await Axios.get(
        `/api/users/currentById/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const currentUserData = response.data;
      console.log(currentUserData)
      // Store the current user information in localStorage
      //localStorage.setItem("userInfo", JSON.stringify(currentUserData));
    //localStorage.setItem("currentUser", JSON.stringify(currentUserData));
      localStorage.setItem("profilePhoto", currentUserData.profilePhoto);
      return currentUserData;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      // Update the userInfo state with the token
      ctxDispatch({ type: "USER_SIGNIN", payload: { ...data } });
      ctxDispatchW({ type: "USER_SIGNIN", payload: { ...data } });
      // Store the user info (including the token) in localStorage
      localStorage.setItem("userInfo", JSON.stringify({ ...data }));
      Axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      // Redirect the user to the specified URL or the homepage
      fetchCurrentUserById(data._id, data.token);
      fetchWishlistItems(data.token);
      fetchcartItems(data.token);
      navigate(redirect || "/");
    } catch (err) {
      alert("Invalid email or password");
    }
    //window.location.reload();
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div>
      {/* <div className="navbar">
        <Navbar />
      </div> */}
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
              <div className="login-form">
                <div className="title">Login</div>
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
                    <div className="input-box">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="text">
                      <a href="#">Forgot password?</a>
                    </div>
                    <div className="button input-box">
                      <input type="submit" value="Submit" />
                    </div>
                    <div className="text sign-up-text">
                      Don't have an account?
                      <Link to={`/signup?redirect=${redirect}`}>
                        Create an account
                      </Link>
                    </div>

                    <div className="text sign-up-text">
                      Forgot password?
                      <Link to={`/forget-password`}>
                        Reset password
                      </Link>
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

export default Profile;

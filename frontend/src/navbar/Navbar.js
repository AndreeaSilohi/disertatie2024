import * as React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, User, SignOut, HeartStraight } from "phosphor-react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import Badge from "@mui/material/Badge";
import { Store } from "../Store";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { InputLabel } from "@mui/material";
import Divider from "@mui/material/Divider";
function Navbar() {
  const [stateCart, setstateCart] = React.useState({
    right: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href='/signin';
  };
  return (
    <div className="navbar">
      <img className="logo" src={logo}></img>
      <ul className="nav-links">
        <NavLink
          to="/"
          exact
          className="nav-link"
          style={({ isActive }) =>
            isActive ? { color: "orange" } : { color: "black" }
          }
        >
          Acasa
        </NavLink>
        <NavLink
          to="/shop"
          className="nav-link"
          style={({ isActive }) =>
            isActive ? { color: "orange" } : { color: "black" }
          }
        >
          Magazinul nostru
        </NavLink>
        <NavLink
          to="/about"
          className="nav-link"
          style={({ isActive }) =>
            isActive ? { color: "orange" } : { color: "black" }
          }
        >
          Despre
        </NavLink>
        <NavLink
          to="/curiosities"
          className="nav-link"
          style={({ isActive }) =>
            isActive ? { color: "orange" } : { color: "black" }
          }
        >
          Curiozitati
        </NavLink>
        <NavLink
          to="/contact-form"
          className="nav-link"
          style={({ isActive }) =>
            isActive ? { color: "orange" } : { color: "black" }
          }
        >
          Contact
        </NavLink>
      </ul>

      <div className="sidenav">
        <NavLink to="/wishlist">
          <HeartStraight size={28} />
        </NavLink>
      </div>

      <NavLink to="/cart" className="nav-link">
        <div className="nav-item">
          <div className="cart-nav">
            <Badge
              badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              color="error"
            >
              <ShoppingCart size={28} />
            </Badge>
          </div>
          {userInfo ? (
            <div>
              <InputLabel>{userInfo.name}</InputLabel>
              <Select>
                <MenuItem value={0} disabled>
                  {/* Placeholder */}
                </MenuItem>
                <MenuItem value={1} component={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem value={2} component={Link} to="/orderhistory">
                  Order History
                </MenuItem>
                <Divider />
                <Link to="#signout" onClick={signoutHandler}>
                  Sign out
                </Link>
              </Select>
            </div>
          ) : (
            <Link to="/signin">Sign In</Link>
          )}
        </div>
      </NavLink>
      {/* <div className="profile-icons">
        <NavLink to="/profile">
          <User size={28} />
        </NavLink>
        <SignOut size={28} onClick={handleLogout} />
      </div> */}
    </div>
  );
}

function handleLogout() {
  // Implement your logout logic here
  console.log("Logout clicked");
}

export default Navbar;

import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { ShoppingCart, HeartStraight, List } from "phosphor-react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import Badge from "@mui/material/Badge";
import { Store } from "../Store";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  InputLabel,
  Divider,
  Drawer,
  List as MuiList,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { getError } from "../utils";
import axios from "axios";
function Navbar() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        console.log(data); // Log the data received from the API
        setCategories(data);
      } catch (err) {
        window.alert(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };



  console.log(categories)
  const toggleSidebar = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  return (
    <div className={sidebarIsOpen ? "navbar active-cont" : "navbar"}>
      <div className="burger-menu" onClick={toggleSidebar}>
        <List size={28} />
      </div>

      <img className="logo" src={logo} alt="Logo" />

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
          </div>
      </NavLink>
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
 

      {/* Sidebar */}
      <Drawer anchor="left" open={sidebarIsOpen} onClose={toggleSidebar}>
        <MuiList className="sidebar-list">
          {categories.map((category) => (
            <ListItem
              key={category}
              component={Link}
              to={`/search?category=${category}`}
              onClick={() => setSidebarIsOpen(false)}
            >
              {/* Displaying category text */}
              <ListItemText>
                <Typography variant="body1">{category}</Typography>
              </ListItemText>
              {/* Add an icon if needed */}
            </ListItem>
          ))}
        </MuiList>
      </Drawer>
    </div>
  );
}

export default Navbar;

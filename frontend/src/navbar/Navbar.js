import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  ShoppingCart,
  HeartStraight,
  List,
  UserCircle,
  User,
  ListBullets,
  SignOut,
  SignIn,
} from "phosphor-react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import Badge from "@mui/material/Badge";
import { Store } from "../Store";
import MenuItem from "@mui/material/MenuItem";
import { Wishlist } from "../W";
import {
  Divider,
  Drawer,
  List as MuiList,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Menu,
} from "@mui/material";
import { getError } from "../utils";
import axios from "axios";
function Navbar() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);


  const { stateW, dispatch: ctxDispatchW } = useContext(Wishlist);
  const {
    wishlist: { wishlistItems },
  } = stateW;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        window.alert(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    ctxDispatchW({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href ="/signin";
};

  const toggleSidebar = () => {
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={sidebarIsOpen ? "navbar active-cont" : "navbar"}>
      <div className="div-logo-menu">
        <div className="burger-menu" onClick={toggleSidebar}>
          <List size={28} />
        </div>

        <img className="logo" src={logo} alt="Logo" />
        {/* <SearchBox /> */}
      </div>

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
      <div className="icons">
        <NavLink to="/wishlist">
        <IconButton color="inherit">
            <Badge
              badgeContent={wishlistItems.length} // Total items in the wishlist
              color="secondary" // You can change the color as needed
            >
              <HeartStraight style={{ color: "black" }} size={30} />
            </Badge>
          </IconButton>
        </NavLink>

        <NavLink to="/cart" className="nav-link">
          <Badge
            badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
            color="error"
          >
            <IconButton color="inherit">
              <ShoppingCart style={{ color: "black" }} size={30} />
            </IconButton>
          </Badge>
        </NavLink>
        {userInfo ? (
          <div>
            <IconButton
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <UserCircle size={32} />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                style={{ display: "flex", alignItems: "center" }}
                value={1}
                component={Link}
                to="/profile"
                onClick={handleMenuClose}
              >
                <User size={20} style={{ marginRight: "2px" }} />
                <span style={{ marginLeft: "4px" }}>Profile</span>
              </MenuItem>
              <Divider />
              <MenuItem
                style={{ display: "flex", alignItems: "center" }}
                value={2}
                component={Link}
                to="/orderhistory"
                onClick={handleMenuClose}
              >
                <ListBullets size={20} style={{ marginRight: "2px" }} />
                <span style={{ marginLeft: "4px" }}>Order history</span>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={signoutHandler}
                style={{ display: "flex", alignItems: "center" }}
              >
                <SignOut size={20} style={{ marginRight: "2px" }} />
                <span style={{ marginLeft: "4px" }}>Sign out</span>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Link to="/signin">
            <SignIn
              size={32}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "2px",
                color: "black",
              }}
            />
          </Link>
        )}
        {userInfo && userInfo.isAdmin && (
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              style={{ display: "flex", alignItems: "center" }}
              value={1}
              component={Link}
              to="/admin/dashboard"
              onClick={handleMenuClose}
            >
              <User size={20} style={{ marginRight: "2px" }} />
              <span style={{ marginLeft: "4px" }}>Dashboard</span>
            </MenuItem>
            <Divider />
            <MenuItem
              style={{ display: "flex", alignItems: "center" }}
              value={2}
              component={Link}
              to="/admin/products"
              onClick={handleMenuClose}
            >
              <ListBullets size={20} style={{ marginRight: "2px" }} />
              <span style={{ marginLeft: "4px" }}>Products</span>
            </MenuItem>

            <Divider />
            <MenuItem
              onClick={signoutHandler}
              style={{ display: "flex", alignItems: "center" }}
              to="/admin/orders"
            >
              <SignOut size={20} style={{ marginRight: "2px" }} />
              <span style={{ marginLeft: "4px" }}>Orders</span>
            </MenuItem>

            <Divider />
            <MenuItem
              to="/admin/users"
              onClick={signoutHandler}
              style={{ display: "flex", alignItems: "center" }}
            >
              <SignOut size={20} style={{ marginRight: "2px" }} />
              <span style={{ marginLeft: "4px" }}>Users</span>
            </MenuItem>

            <Divider />
            <MenuItem
                onClick={signoutHandler}
                style={{ display: "flex", alignItems: "center" }}
              >
                <SignOut size={20} style={{ marginRight: "2px" }} />
                <span style={{ marginLeft: "4px" }}>Sign out</span>
              </MenuItem>
          </Menu>
        )}
      </div>
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

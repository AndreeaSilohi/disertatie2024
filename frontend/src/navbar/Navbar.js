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

  const { stateW, dispatch: ctxDispatchW } = useContext(Wishlist);
  const {
    wishlist: { wishlistItems },
  } = stateW;
  const wishlistCount = wishlistItems.length;

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);

        if (userInfo) {
          const userResult = await axios.get(
            `/api/users/profile/${userInfo._id}`,
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          setUser(userResult.data);
        }
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
    localStorage.removeItem("profilePhoto");
    window.location.href = "/signin";
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
  let urlProfile;
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      urlProfile = data.url;
      console.log(urlProfile);
      localStorage.setItem("profilePhoto", urlProfile);//UPDATEZ LOCAL STORAGE CU FOTOGRAFIA PENTRU CA ACUM AFISEZ FOTOGRAFIA DIN LOCALSTORAGE VEZI SIGN IN 71
      window.alert("Image uploaded successfully");
      console.log("Uploaded photo URL:", data.url);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };


  const handleSubmit = async () => {
    try {
      const fileInput = document.getElementById("photoInput");
      if (fileInput.files.length === 0) {
        window.alert("Please select a file.");
        return;
      }

      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post("/api/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      const urlProfile = data.url;
      console.log(urlProfile);
      await axios.put(
        `/api/users/update-photo/${userInfo._id}`,
        { profilePhoto: urlProfile },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      window.alert("Image uploaded successfully");

      // Update user state with the new profile photo URL
      setUser({ ...user, profilePhoto: urlProfile });

      console.log("Uploaded photo URL:", data.url);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const profilePhoto = localStorage.getItem("profilePhoto");
  return (
    <div className={sidebarIsOpen ? "navbar active-cont" : "navbar"}>
      <div className="div-logo-menu">
        <div className="burger-menu" onClick={toggleSidebar}>
          <List size={28} />
        </div>
        <img className="logo" src={logo} alt="Logo" />
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
            <Badge badgeContent={wishlistCount} color="secondary">
              <HeartStraight style={{ color: "black" }} size={30} />
            </Badge>
          </IconButton>
        </NavLink>

        <NavLink to="/cart">
          <Badge
            badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
            color="secondary" //daca vreau cu rosu trebuie sa fie error
          >
            {/* <IconButton color="inherit"> */}
            <ShoppingCart style={{ color: "black" }} size={30} />
            {/* </IconButton> */}
          </Badge>
        </NavLink>
        {userInfo ? (
          <>
            {userInfo.isAdmin ? (
              // Render admin menu
              <div>
                <IconButton
                  color="inherit"
                  aria-controls="admin-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <UserCircle style={{ color: "black" }} size={30} />
                </IconButton>
                <Menu
                  id="admin-menu"
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
                    style={{ display: "flex", alignItems: "center" }}
                    value={3}
                    component={Link}
                    to="/admin/orders"
                    onClick={handleMenuClose}
                  >
                    <span style={{ marginLeft: "4px" }}>Orders</span>
                  </MenuItem>

                  <Divider />
                  <MenuItem
                    style={{ display: "flex", alignItems: "center" }}
                    value={4}
                    component={Link}
                    to="/admin/users"
                    onClick={handleMenuClose}
                  >
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
              </div>
            ) : (
              // Render user menu
              <div>
                <img
                  src={profilePhoto }
                  alt="user"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginTop: "20px",
                  }}
                  aria-controls="user-menu"
                  onClick={handleMenuOpen}
                />

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      id="photoInput"
                    />
                  </MenuItem>
                  <button onClick={handleSubmit}>Submit</button>
                  <Divider />
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
            )}
          </>
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
              <ListItemText>
                <Typography variant="body1">{category}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </MuiList>
      </Drawer>
    </div>
  );
          }
export default Navbar;

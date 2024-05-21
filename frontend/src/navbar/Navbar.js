import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShoppingCart,
  HeartStraight,
  List,
  ListBullets,
  SignOut,
  SignIn,
  UploadSimple,
  UserCircle,
  Users,
  ChartLine,
} from 'phosphor-react';
import './Navbar.css';
import logo from '../assets/logo.png';
import Badge from '@mui/material/Badge';
import { Store } from '../Store';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import { Wishlist } from '../W';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {
  Divider,
  Drawer,
  List as MuiList,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Menu,
} from '@mui/material';
import { getError } from '../utils';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
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
  const [notification, setNotification] = useState(null);

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
    ctxDispatch({ type: 'USER_SIGNOUT' });
    ctxDispatchW({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    localStorage.removeItem('profilePhoto');
    window.location.href = '/signin';
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
    formData.append('file', file);

    try {
      const { data } = await axios.post('/api/upload/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      urlProfile = data.url;
      await axios.put(
        `/api/users/update-photo/${userInfo._id}`,
        { profilePhoto: urlProfile },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      // window.alert('Image uploaded successfully');
      setNotification({
        type: 'success',
        message: 'Imagine încărcată cu succes',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      // Update user state with the new profile photo URL
      setUser({ ...user, profilePhoto: urlProfile });
      localStorage.setItem('profilePhoto', urlProfile); //UPDATEZ LOCAL STORAGE CU FOTOGRAFIA PENTRU CA ACUM AFISEZ FOTOGRAFIA DIN LOCALSTORAGE VEZI SIGN IN 71

      console.log('Uploaded photo URL:', data.url);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const fileInput = document.getElementById('photoInput');
  //     if (fileInput.files.length === 0) {
  //       window.alert('Please select a file.');
  //       return;
  //     }

  //     const file = fileInput.files[0];
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     const { data } = await axios.post('/api/upload/profile', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });

  //     const urlProfile = data.url;
  //     console.log(urlProfile);
  //     await axios.put(
  //       `/api/users/update-photo/${userInfo._id}`,
  //       { profilePhoto: urlProfile },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userInfo.token}`,
  //         },
  //       }
  //     );
  //     window.alert('Image uploaded successfully');

  //     // Update user state with the new profile photo URL
  //     setUser({ ...user, profilePhoto: urlProfile });

  //     console.log('Uploaded photo URL:', data.url);
  //   } catch (error) {
  //     console.error('Error uploading photo:', error);
  //   }
  // };

  const profilePhoto = localStorage.getItem('profilePhoto');
  return (
    <div>
      <div className={sidebarIsOpen ? 'navbar active-cont' : 'navbar'}>
        <div className="div-logo-menu">
          {userInfo && ( // Render sidebar only if user is logged in
            <div className="burger-menu" onClick={toggleSidebar}>
              <List size={28} />
            </div>
          )}
          <img className="logo" src={logo} alt="Logo" />
        </div>

        <ul className="nav-links">
          <NavLink
            to="/"
            exact
            className="nav-link"
            style={({ isActive }) =>
              isActive ? { color: 'orange' } : { color: 'black' }
            }
          >
            Acasă
          </NavLink>
          <NavLink
            to="/shop"
            className="nav-link"
            style={({ isActive }) =>
              isActive ? { color: 'orange' } : { color: 'black' }
            }
          >
            Magazinul nostru
          </NavLink>
          <NavLink
            to="/about"
            className="nav-link"
            style={({ isActive }) =>
              isActive ? { color: 'orange' } : { color: 'black' }
            }
          >
            Despre
          </NavLink>
          <NavLink
            to="/curiosities"
            className="nav-link"
            style={({ isActive }) =>
              isActive ? { color: 'orange' } : { color: 'black' }
            }
          >
            Curiozități
          </NavLink>
          <NavLink
            to="/contact-form"
            className="nav-link"
            style={({ isActive }) =>
              isActive ? { color: 'orange' } : { color: 'black' }
            }
          >
            Contact
          </NavLink>
        </ul>
        <div className="icons">
          <div className="icons-wishlist-cart">
            <NavLink to="/wishlist" style={{marginRight:"-10px"}}>
              <IconButton color="inherit">
                <Badge badgeContent={wishlistCount} color="success">
                  <HeartStraight style={{ color: 'black' }} size={30} />
                </Badge>
              </IconButton>
            </NavLink>

            <NavLink to="/cart">
              <IconButton color="inherit">
                <Badge
                  badgeContent={cart.cartItems.reduce(
                    (a, c) => a + c.quantity,
                    0
                  )}
                  color="success"
                >
                  <ShoppingCart style={{ color: 'black' }} size={30} />
                </Badge>
              </IconButton>
            </NavLink>
          </div>
          <div className="icons-profile">
            {userInfo ? (
              <>
                {userInfo.isAdmin ? (
                  // Render admin menu
                  <div className="admin-menu">
                    <LightTooltip title="Panou de administrare">
                      <IconButton
                        color="inherit"
                        aria-controls="admin-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                      >
                        <UserCircle style={{ color: 'black' }} size={40} />
                      </IconButton>
                    </LightTooltip>
                    <Menu
                      id="admin-menu"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                        value={1}
                        component={Link}
                        to="/admin/dashboard"
                        onClick={handleMenuClose}
                      >
                        <ChartLine size={20} style={{ marginRight: '2px' }} />

                        <span className="span-menu">Monitorizare vânzări</span>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                        value={2}
                        component={Link}
                        to="/admin/products"
                        onClick={handleMenuClose}
                      >
                        <ListBullets size={20} style={{ marginRight: '2px' }} />
                        <span className="span-menu">Produse</span>
                      </MenuItem>

                      <Divider />
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                        value={3}
                        component={Link}
                        to="/admin/orders"
                        onClick={handleMenuClose}
                      >
                        <List size={20} style={{ marginRight: '2px' }} />
                        <span className="span-menu">Comenzi</span>
                      </MenuItem>

                      <Divider />
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                        value={4}
                        component={Link}
                        to="/admin/users"
                        onClick={handleMenuClose}
                      >
                        <Users size={20} style={{ marginRight: '2px' }} />
                        <span className="span-menu">Utilizatori</span>
                      </MenuItem>

                      <Divider />
                      <MenuItem
                        onClick={signoutHandler}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <SignOut size={20} style={{ marginRight: '2px' }} />
                        <span className="span-menu">Delogare</span>
                      </MenuItem>
                    </Menu>
                  </div>
                ) : (
                  // Render user menu
                  <div className="user-menu">
                    <LightTooltip title="Contul meu">
                      <Avatar
                        alt="user"
                        src={profilePhoto}
                        sx={{ width: 40, height: 40 }}
                        onClick={handleMenuOpen}
                      />
                    </LightTooltip>
                    <Menu
                      id="user-menu"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <label
                          htmlFor="photoInput"
                          style={{ cursor: 'pointer' }}
                        >
                          <UploadSimple
                            size={20}
                            style={{ marginRight: '2px' }}
                          />
                          <span className="span-menu">Încarcă fotografie</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          id="photoInput"
                          style={{ display: 'none' }}
                        />
                      </MenuItem>

                      <Divider />
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                        value={1}
                        component={Link}
                        to="/profile"
                        onClick={handleMenuClose}
                      >
                        <UserCircle size={25} style={{ marginRight: '5px' }} />
                        <span className="span-menu">Actualizare date</span>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        style={{ display: 'flex', alignItems: 'center' }}
                        value={2}
                        component={Link}
                        to="/orderhistory"
                        onClick={handleMenuClose}
                      >
                        <ListBullets size={20} style={{ marginRight: '2px' }} />
                        <span className="span-menu">Istoric comenzi</span>
                      </MenuItem>

                      <Divider />
                      <MenuItem
                        onClick={signoutHandler}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <SignOut size={20} style={{ marginRight: '2px' }} />
                        <span className="span-menu">Delogare</span>
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
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '2px',
                    color: 'black',
                  }}
                />
              </Link>
            )}
          </div>
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
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          {/* <button onClick={handleCloseNotification}>Close</button> */}
        </div>
      )}
    </div>
  );
}
export default Navbar;

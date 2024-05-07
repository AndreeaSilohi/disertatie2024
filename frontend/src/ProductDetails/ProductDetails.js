// ProductDetails.js

import React, {
  useState,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import productSingle from '../assets/productSingle.png';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import Box from '@mui/material/Box';
import './ProductDetails.css';
import axios from 'axios';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import { Store } from '../Store';
import RatingComponent from '../Rating/RatingComponent';
import { getError } from '../utils';
import { ShoppingCartSimple, UserCircle } from 'phosphor-react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const formatDate = (dateString) => {
  const months = [
    'ianuarie',
    'februarie',
    'martie',
    'aprilie',
    'mai',
    'iunie',
    'iulie',
    'august',
    'septembrie',
    'octombrie',
    'noiembrie',
    'decembrie',
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const ProductDetails = () => {
  let reviewsRef = useRef(null);
  const params = useParams();
  const { slug } = params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [value, setValue] = React.useState(0);
  const [notification, setNotification] = useState(null);

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });

  const [{ ordersLoading, ordersError, orders }, setOrders] = useState({
    orders: [],
    ordersLoading: true,
    ordersError: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },

    userInfo,
  } = state;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });

        // Fetch user data
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
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/mine', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders({ orders: data, ordersLoading: false, ordersError: '' });
      } catch (error) {
        setOrders({
          orders: [],
          ordersLoading: false,
          ordersError: getError(error),
        });
      }
    };
    if (userInfo) {
      fetchOrders();
    }
    handleClickAdditionalInfo('info'); //adaugat
  }, [slug, userInfo]);

  // console.log(orders);
  // console.log(slug);
  const isProductInOrders = () => {
    return orders.some((order) =>
      order.orderItems.some((item) => item && item.slug === slug)
    );
  };

  // const cartItemAmount = cartItems[product.id];
  const [selectedTab, setSelectedTab] = useState('info');
  const [selectedTabReviews, setSelectedTabReviews] = useState(null);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);
  const [additionalInfoVisibleReviews, setAdditionalInfoVisibleReviews] =
    useState(false);

  const handleClickAdditionalInfo = (tab) => {
    setSelectedTab(tab);
    setAdditionalInfoVisible(tab === 'info' ? true : false);
    setAdditionalInfoVisibleReviews(false);

    setSelectedTabReviews(null); //pt a reveni la culoarea initiala
  };

  const handleClickReviews = (tab) => {
    setSelectedTabReviews(tab);
    setAdditionalInfoVisibleReviews(tab === 'reviews' ? true : false);
    setAdditionalInfoVisible(false);

    setSelectedTab(null);
  };

  const navigate = useNavigate();
  const addToCartHandler = async (product, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      alert('You are not logged in. Please log in to add items to the cart.');
      return;
    }

    try {
      // Check stock availability
      const { data } = await axios.get(`/api/products/${product._id}`);

      const existItem = cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;

      if (data.stoc < quantity) {
        window.alert('Sorry. Product is out of stock');
        return;
      }

      const token = userInfo?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      if (existItem) {
        // If the product already exists in the cart, update its quantity
        const response = await axios.put(
          `/api/cart/${existItem._id}`,
          { quantity: quantity },
          { headers: headers }
        );
      } else {
        const response = await axios.post(
          '/api/cart',
          {
            quantity: quantity,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            productId: product._id, // Ensure productId is provided correctly
            stoc: product.stoc,
          },
          {
            headers: headers,
          }
        );
      }

      // Dispatch action to update the cart in the context/state
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity }, // Assuming the server responds with the updated cart data
      });
      // ctxDispatch({ type: "CREATE_SUCCESS" });
      setNotification(`${product.name} a fost adăugat în coș`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      // Show notification or handle success
      // console.log(`${product.name} was added to the cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      window.alert('Failed to add to cart. Please try again later.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      window.alert('Please enter a comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
          name: userInfo.name,
          profilePhoto: user.profilePhoto,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      window.alert('Review submitted successfully!');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });

      setRating(0); // Assuming initial value for rating is 0
      setComment('');
      
    } catch (error) {
      window.alert(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return (
    <div className="detalii-page">
      {error ? (
        <div style={{ height: '100vh' }}>
          <MessageBox severity="error">{error}</MessageBox>
        </div>
      ) : (
        <>
          <div>
            <img className="product-single" src={productSingle} />
          </div>

          <div className="detalii-container">
            <div className="detalii-sus">
              <div className="detalii-card">
                <img className="card-media" src={product.image} alt="Miere" />
              </div>

              <div className="detalii-produs">
                <div className="detalii-titlu">
                  <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '35px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {product.name}
                  </Typography>
                </div>
                <div className="detalii-pret">
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {product.price} lei
                  </Typography>
                </div>
                <div className="status">
                  {product.stoc > 0 ? (
                    <div className="in-stock">În stoc</div>
                  ) : (
                    <div className="unavailable">Indisponibil</div>
                  )}
                </div>
                <div className="raiting">
                  <Box
                    sx={{
                      '& > legend': { mt: 2 },
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    <RatingComponent
                      rating={product.rating}
                      numReviews={product.numReviews}
                    >
                      {' '}
                    </RatingComponent>
                  </Box>
                </div>
                <div className="detalii-quantity">
                  {product.stoc === 0 ? (
                    <Button
                      variant="contained"
                      sx={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '15px',
                        textTransform: 'uppercase',
                      }}
                      disabled
                    >
                      Epuizat
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#FFA500' }}
                      sx={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '15px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                      }}
                      onClick={(event) => addToCartHandler(product, event)}
                    >
                      <ShoppingCartSimple size={24} />
                      &nbsp; Adaugă în coș
                    </Button>
                  )}
                </div>
                <div className="detalii-descriere"></div>
                <div className="accordion-detalii">
                  <Accordion
                    sx={{
                      backgroundColor: 'white',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography
                        sx={{
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        Detalii produs
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        sx={{
                          fontSize: '15px',
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        {product.description}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </div>

            <div className="detalii-jos">
              <div className="group-btn">
                <div
                  className={`info-review ${
                    selectedTab === 'info' ? 'selected' : ''
                  }`}
                  onClick={() => handleClickAdditionalInfo('info')}
                >
                  INFORMAȚII ADIȚIONALE
                </div>
                <div
                  className={`info-review ${
                    selectedTabReviews === 'reviews' ? 'selected' : ''
                  }`}
                  onClick={() => handleClickReviews('reviews')}
                >
                  RECENZII ({product.numReviews})
                </div>
              </div>
              {/* <div className="divider"></div> */}

              {additionalInfoVisible && (
                <div className="additional-info">
                  <Typography
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '20px',
                      lineHeight: '25px',
                      padding: '0px 60px 60px 100px',
                    }}
                  >
                    {product.additional}
                  </Typography>
                </div>
              )}

              {additionalInfoVisibleReviews && (
                <div className="review-form" ref={reviewsRef}>
                  {/* <p className="recenzii-title"ref={reviewsRef}>Recenzii</p> */}
                  <div className="no-review">
                    {product.reviews.length === 0 && (
                      <MessageBox>Nu există recenzii</MessageBox>
                    )}
                  </div>
                  <List>
                    {product.reviews.map((review) => (
                      <ListItem key={review._id}>
                        <ListItemText
                          sx={{
                            fontFamily: 'Montserrat, sans-serif !important',
                            fontSize: '25px',
                          }}
                        >
                          <div className="review-img-name">
                            <div>
                              {/* {user.isAdmin ? (
                                <UserCircle size={70} /> // Render icon for administrator
                              ) : ( */}
                                <img
                                  src={review.profilePhoto}
                                  alt="User Avatar"
                                  className="avatar-recenzie"
                                />
                              {/* )} */}
                            </div>
                            <div>
                              <div className="stars-name">
                                <RatingComponent
                                  rating={review.rating}
                                  caption=" "
                                />
                                <p
                                  style={{
                                    marginTop: '5px',
                                    fontFamily: 'Montserrat, sans-serif',
                                  }}
                                >
                                  <strong>{review.name}&nbsp;&nbsp;</strong>-
                                  {formatDate(review.createdAt)}{' '}
                                </p>
                              </div>{' '}
                            </div>
                          </div>
                          <div className="comment">
                            <p>{review.comment}</p>
                          </div>
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>

                  <div className="user-info-review">
                    {!loading && !error && (
                      <>
                        {isProductInOrders() ? (
                          // Show the review form only if the product is in orders
                          <div className="user-info-review">
                            {userInfo ? (
                              <form onSubmit={submitHandler}>
                                <p className="p-lasa-recenzie">
                                  Lasă o recenzie
                                </p>

                                <FormControl fullWidth>
                                  <InputLabel id="rating-label">
                                    Rating
                                  </InputLabel>
                                  <Select
                                    labelId="rating-label"
                                    id="rating"
                                    value={rating}
                                    label="Ra ting"
                                    onChange={(e) => setRating(e.target.value)}
                                  >
                                    <MenuItem value="">
                                      <em>Selectează...</em>
                                    </MenuItem>
                                    <MenuItem value={1}>1- Slab</MenuItem>
                                    <MenuItem value={2}>2- Acceptabil</MenuItem>
                                    <MenuItem value={3}>3- Bun</MenuItem>
                                    <MenuItem value={4}>4- Foarte bun</MenuItem>
                                    <MenuItem value={5}>5- Excelent</MenuItem>
                                  </Select>
                                  {/* <FormHelperText>
                                    Please select a rating
                                  </FormHelperText> */}
                                </FormControl>
                                <TextField
                                  id="comment"
                                  label="Comentariu"
                                  placeholder="Lasă un comentariu"
                                  margin="normal"
                                  multiline
                                  fullWidth
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                />
                                <Button
                                  disabled={loadingCreateReview}
                                  type="submit"
                                  variant="contained"
                                  sx={{ mt: 2, backgroundColor: '#FFA500' }}
                                >
                                  Trimite
                                </Button>
                                {loadingCreateReview && (
                                  <LoadingBox></LoadingBox>
                                )}
                              </form>
                            ) : (
                              <MessageBox>
                                Please <Link to={'/signin'}>Sign In</Link> to
                                write a review
                              </MessageBox>
                            )}
                          </div>
                        ) : (
                          // Show a message if the product is not in orders
                          <MessageBox>
                            {userInfo ? (
                              'This product is not in your orders. You cannot let a review'
                            ) : (
                              <>
                                Please <Link to={'/signin'}>Sign In</Link> to
                                write a review
                              </>
                            )}
                          </MessageBox>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {loading && <LoadingBox />}
          {notification && <div className="notification">{notification}</div>}
        </>
      )}
    </div>
  );
};

export default ProductDetails;

// ProductDetails.js

import React, {
  useState,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Navbar from "../navbar/Navbar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import productSingle from "../assets/productSingle.png";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import Box from "@mui/material/Box";
import "./ProductDetails.css";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Store } from "../Store";
import RatingComponent from "../Rating/RatingComponent";
import { getError } from "../utils";


const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductDetails = () => {
  let reviewsRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const params = useParams();
  const { slug } = params;
  const [value, setValue] = React.useState(0);
  const [notification, setNotification] = useState(null);
  // const { addToCart, cartItems } = useContext(ShopContext); // Use the ShopContext


  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });


    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
      cart: { cartItems },
  
      userInfo,
    } = state;
  
    console.log(userInfo);
    const [user, setUser] = useState(null);
    console.log(user)

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);

        dispatch({ type: "FETCH_SUCCESS", payload: result.data });

        // Fetch user data
        if(userInfo){
          const userResult = await axios.get(`/api/users/profile/${userInfo._id}`,{
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setUser(userResult.data);
        }

      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, [slug]);
console.log(user)
  // const cartItemAmount = cartItems[product.id];

  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedTabReviews, setSelectedTabReviews] = useState(null);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);
  const [additionalInfoVisibleReviews, setAdditionalInfoVisibleReviews] =
    useState(false);

  const handleClickAdditionalInfo = (tab) => {
    setSelectedTab(tab);
    setAdditionalInfoVisible(tab === "info" ? true : false);
    setAdditionalInfoVisibleReviews(false);

    setSelectedTabReviews(null); //pt a reveni la culoarea initiala
  };

  const handleClickReviews = (tab) => {
    setSelectedTabReviews(tab);
    setAdditionalInfoVisibleReviews(tab === "reviews" ? true : false);
    setAdditionalInfoVisible(false);

    setSelectedTab(null);
  };




  const navigate = useNavigate();
  const addToCartHandler = async (product, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      alert("You are not logged in. Please log in to add items to the cart.");
      return;
    }

    try {
      // Check stock availability
      const { data } = await axios.get(`/api/products/${product._id}`);

      const existItem = cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;

      if (data.stoc < quantity) {
        window.alert("Sorry. Product is out of stock");
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
          "/api/cart",
          {
            quantity: quantity,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            productId: product._id, // Ensure productId is provided correctly
          },
          {
            headers: headers,
          }
        );
      }

      // Dispatch action to update the cart in the context/state
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...product, quantity }, // Assuming the server responds with the updated cart data
      });
      // ctxDispatch({ type: "CREATE_SUCCESS" });
      setNotification(`${product.name} was added to the cart`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      // Show notification or handle success
      console.log(`${product.name} was added to the cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      window.alert("Failed to add to cart. Please try again later.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      window.alert("Please enter a comment and rating");
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

      console.log(user)

      dispatch({
        type: "CREATE_SUCCESS",
      });
      window.alert("Review submitted successfully!");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      window.alert(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };
  return (
    <div className="detalii-page">
      <div className="detalii-navbar">
        <Navbar />
      </div>

      {error ? (
        <div style={{ height: "100vh" }}>
          <MessageBox severity="error">{error}</MessageBox>
        </div>
      ) : (
        <>
          <div>
            <img className="product-single" src={productSingle} />
          </div>

          <div className="detalii-container">
            <div className="detalii-left">
              <div className="detalii-card">
                <img
                  className="card-media"
                  src={product.image}
                  alt="Miere"
                  style={{
                    maxWidth: 400,
                    maxHeight: 400,
                    width: "100%",
                  }}
                />
              </div>

              <div className="group-btn">
                <div
                  className={`info-review ${
                    selectedTab === "info" ? "selected" : ""
                  }`}
                  onClick={() => handleClickAdditionalInfo("info")}
                >
                  ADDITIONAL INFORMATIONS
                </div>
                <div
                  className={`info-review ${
                    selectedTabReviews === "reviews" ? "selected" : ""
                  }`}
                  onClick={() => handleClickReviews("reviews")}
                >
                  REVIEWS {product.numReviews}
                </div>
              </div>
              <div className="divider"></div>

              {additionalInfoVisible && (
                <div className="additional-info">
                  <Typography
                    sx={{
                      fontFamily: "Catamaran, sans-serif",
                      fontSize: "20px",
                      lineHeight: "25px",
                      padding: "60px",
                    }}
                  >
                    {product.additional}
                  </Typography>
                </div>
              )}

              {additionalInfoVisibleReviews && (
                <div className="review-form">
                  <h2 ref={reviewsRef}>Reviews</h2>
                  <div className="no-review">
                    {product.reviews.length === 0 && (
                      <MessageBox>There are no reviews</MessageBox>
                    )}
                  </div>
                  <List>
                    {product.reviews.map((review) => (
                      <ListItem key={review._id}>
                        <ListItemText
                          sx={{
                            fontFamily: "Catamaran, sans-serif !important",
                            fontSize: "25px",
                          }}
                        >
                          <img
                            src={review.profilePhoto}
                            alt="User Avatar"
                            style={{
                              width: "30px", // Set the width of the image
                              height: "30px", // Set the height of the image
                              borderRadius: "50%", // Make the image circular
                              marginTop: "20px",
                            }}
                          ></img>
                          <strong>
                            {review.name}&nbsp;-&nbsp;
                            {review.createdAt.substring(0, 10)}
                          </strong>
                          <RatingComponent rating={review.rating} caption=" " />
                          {/* <p >{review.createdAt.substring(0, 10)}</p> */}
                          <p>{review.comment}</p>
                        </ListItemText>
                      </ListItem>
                    ))}
                  </List>
                  <div className="user-info-review">
                    {userInfo ? (
                      <form onSubmit={submitHandler}>
                        <h2>Write a customer review</h2>

                        <FormControl fullWidth>
                          <InputLabel id="rating-label">Rating</InputLabel>
                          <Select
                            labelId="rating-label"
                            id="rating"
                            value={rating}
                            label="Rating"
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <MenuItem value="">
                              <em>Select...</em>
                            </MenuItem>
                            <MenuItem value={1}>1- Poor</MenuItem>
                            <MenuItem value={2}>2- Fair</MenuItem>
                            <MenuItem value={3}>3- Good</MenuItem>
                            <MenuItem value={4}>4- Very good</MenuItem>
                            <MenuItem value={5}>5- Excellent</MenuItem>
                          </Select>
                          <FormHelperText>
                            Please select a rating
                          </FormHelperText>
                        </FormControl>
                        <TextField
                          id="comment"
                          label="Comments"
                          placeholder="Leave a comment here"
                          multiline
                          fullWidth
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                          disabled={loadingCreateReview}
                          type="submit"
                          variant="contained"
                          sx={{ mt: 2 }}
                        >
                          Submit
                        </Button>
                        {loadingCreateReview && <LoadingBox></LoadingBox>}
                      </form>
                    ) : (
                      <MessageBox>
                        Please <Link to={"/signin"}>Sign In</Link> to write a
                        review
                      </MessageBox>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="detalii-right">
              <div className="detalii-titlu">
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  sx={{
                    fontFamily: "Catamaran, sans-serif",
                    fontSize: "35px",
                    textTransform: "uppercase",
                  }}
                >
                  {product.name}
                </Typography>
              </div>
              <div className="detalii-pret">
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "Catamaran, sans-serif",
                    fontSize: "35px",
                    textTransform: "uppercase",
                  }}
                >
                  {product.price} lei
                </Typography>
              </div>
              <div className="status">
                {product.stoc > 0 ? (
                  <div className="in-stock">In stock</div>
                ) : (
                  <div className="unavailable">Unavailable</div>
                )}
              </div>
              <div className="raiting">
                <Box
                  sx={{
                    "& > legend": { mt: 2 },
                    fontFamily: "Catamaran, sans-serif",
                  }}
                >
                  {/* <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                  /> */}
                  <RatingComponent
                    rating={product.rating}
                    numReviews={product.numReviews}
                  >
                    {" "}
                  </RatingComponent>
                </Box>
              </div>
              <div className="detalii-quantity">
                {product.stoc === 0 ? (
                  <Button
                    variant="contained"
                    sx={{
                      fontFamily: "Catamaran, sans-serif",
                      fontSize: "15px",
                      textTransform: "uppercase",
                    }}
                    disabled
                  >
                    Out of stock
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#d77e2b" }}
                    sx={{
                      fontFamily: "Catamaran, sans-serif",
                      fontSize: "15px",
                      textTransform: "uppercase",
                    }}
                    onClick={(event) => addToCartHandler(product, event)}
                  >
                    {" "}
                    Add to cart
                  </Button>
                )}
              </div>
              <div className="detalii-descriere"></div>
              <div className="accordion-detalii">
                <Accordion
                  sx={{
                    backgroundColor: "#edcea8",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      fontFamily: "YourChosenFont, sans-serif", // Set the desired font
                    }}
                  >
                    <Typography>Detalii despre produs</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      sx={{
                        // fontFamily: "Quicksand, sans-serif",
                        fontSize: "15px",
                      }}
                    >
                      {product.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>

              <div className="accordion-recenzii">
                <Accordion
                  sx={{
                    backgroundColor: "#edcea8",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    // sx={{
                    //   fontFamily: "YourChosenFont, sans-serif", // Set the desired font
                    // }}
                  >
                    <Typography>Recenzii</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: "15px",
                      }}
                    >
                      {product.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
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

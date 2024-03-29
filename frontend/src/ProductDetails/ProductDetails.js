// ProductDetails.js

import React, { useState, useContext, useReducer, useEffect } from "react";
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
// import { ShopContext } from "../ShopContextProvider";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import "./ProductDetails.css";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Store } from "../Store";
import RatingComponent from "../Rating/RatingComponent";

const reducer = (state, action) => {
  switch (action.type) {
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
  const params = useParams();
  const { slug } = params;

  const [value, setValue] = React.useState(0);
  const [notification, setNotification] = useState(null);
  // const { addToCart, cartItems } = useContext(ShopContext); // Use the ShopContext

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

  // const cartItemAmount = cartItems[product.id];

  const [selectedTab, setSelectedTab] = useState(null);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);

  const handleClick = (tab) => {
    if (tab === "info") {
      setSelectedTab(tab);
      setAdditionalInfoVisible(true);
    } else {
      setSelectedTab(tab);
      setAdditionalInfoVisible(false);
    }
  };

  // const { state, dispatch: ctxDispatch } = useContext(Store);
  // const { cart } = state;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfoCart,
    userInfo,
  } = state;

  console.log(product);
  const navigate = useNavigate();

  // const handleAddToCart = async () => {
  //   const existItem = cart.cartItems.find((x) => x._id === product._id);
  //   const quantity = existItem ? existItem.quantity + 1 : 1;
  //   const { data } = await axios.get(`/api/products/${product._id}`);

  //   if (data.stoc < quantity) {
  //     window.alert("Sorry. Product is out of stock");
  //     return;
  //   }

  //   ctxDispath({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
  //   navigate("/cart");

  //   setNotification(` Ai adaugat ${product.name} in cos`);
  //   setTimeout(() => {
  //     setNotification(null);
  //   }, 3000);
  // };

  const addToCartHandler = async (product, event) => {
    console.log(product);
    event.preventDefault();
    event.stopPropagation();

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
                  onClick={() => handleClick("info")}
                >
                  ADDITIONAL INFORMATIONS
                </div>
                <div
                  className={`info-review ${
                    selectedTab === "reviews" ? "selected" : ""
                  }`}
                  onClick={() => handleClick("reviews")}
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

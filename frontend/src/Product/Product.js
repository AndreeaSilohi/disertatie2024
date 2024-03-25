import React, { useState, useContext } from "react";
// import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import ProductDetails from "../ProductDetails/ProductDetails";
import { Store } from "../Store";
import Button from "@mui/material/Button";
import axios from "axios";
import "./Product.css";
import { Wishlist } from "../W";

function Product(props) {
  const { product } = props;

  const { stateW, dispatch: ctxDispatchW } = useContext(Wishlist);
  const {
    wishlist: { wishlistItems },
    userInfo,
  } = stateW;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfoCart,
  } = state;

  //   const addToCartHandler = async (item, event) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     const existItem = cartItems.find((x) => x._id === product._id);
  //     const quantity = existItem ? existItem.quantity + 1 : 1;
  //     const { data } = await axios.get(/api/products/${item._id});

  //     if (data.stoc < quantity) {
  //       window.alert("Sorry. Product is out of stock");
  //       return;
  //     }

  //     ctxDispatch({
  //       type: "CART_ADD_ITEM",
  //       payload: { ...item, quantity },
  //     });

  //     setNotification(${data.name} a fost adaugat in wishlist);
  //     setTimeout(() => {
  //       setNotification(null);
  //     }, 3000);
  //   };
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
      ctxDispatchW({ type: "CREATE_SUCCESS" });
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

  const addToWishlist = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      ctxDispatchW({ type: "CREATE_REQUEST" });
      const user = userInfo ? userInfo.user : null;

      const token = userInfo?.token; // Access token if userInfo is set, otherwise, token will be undefined
      const headers = token ? { authorization: `Bearer ${token}` } : {};
      const { data } = await axios.post(
        "/api/wishlist",
        {
          wishlistItems: [
            {
              slug: item.slug,
              name: item.name,
              image: item.image,
              price: item.price,
              product: item._id,
            },
          ],
        },
        {
          headers: headers,
        }
      );
      ctxDispatchW({
        type: "WISHLIST_ADD_ITEM",
        payload: { ...product }, // Assuming the server responds with the updated cart data
      });

      ctxDispatchW({ type: "CREATE_SUCCESS" });
      setNotification(`${item.name} was added to the wishlist`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      ctxDispatchW({ type: "CREATE_FAIL" });
      console.error("Error adding to wishlist:", err);
      window.alert("Failed to add to wishlist. Please try again later.");
    }
  };

  const isInWishlist =
    Array.isArray(wishlistItems) &&
    wishlistItems.some((item) => item._id === product._id);
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <Link
        className="product-link"
        to={`/product/${product.slug}`}
        key={product.name}
      >
        <div
          className="card"
          style={{
            backgroundColor: "#f3f3f3",
            paddingBottom: "25px",
          }}
          onClick={() => handleCardClick(product)}
        >
          <CardMedia
            className="card-content"
            component="img"
            image={product.image}
            alt={product.name}
          />
          <CardContent className="text-card">
            <Typography
              className="typografy-name"
              gutterBottom
              variant="h5"
              component="div"
            >
              {product.name}
            </Typography>
            <Typography className="typografy-price" color="text.secondary">
              Pret: {product.price} de lei
            </Typography>
          </CardContent>

          <div className="actions-card">
            <IconButton
              onClick={(event) => addToWishlist(product, event)} // Pass entire product object
              aria-label="Add to Wishlist"
              color={isInWishlist ? "secondary" : "default"}
              sx={{ marginRight: "8px" }}
            >
              <FavoriteIcon />
            </IconButton>
            {product.stoc === 0 ? (
              <Button variant="contained" disabled>
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
        </div>
      </Link>
      {notification && <div className="notification">{notification}</div>}

      {selectedProduct && <ProductDetails product={selectedProduct} />}
    </div>
  );
}

export default Product;

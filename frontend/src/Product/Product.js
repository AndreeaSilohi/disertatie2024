import React, { useState, useContext, useEffect, useRef } from "react";
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
import MessageBox from "../MessageBox";

function Product(props) {
  let reviewsRef = useRef();
  const { product, userToken } = props;
  const { stateW, dispatch: ctxDispatchW } = useContext(Wishlist);
  const {
    wishlist: { wishlistItems },
  } = stateW;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfoCart,
  } = state;

 

  const fetchWishlistItems = async (token) => {
    console.log(token);
    try {
      const { data } = await axios.get("/api/wishlist", {
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

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    // Check if the product is in the wishlist when the component mounts
    setIsInWishlist(wishlistItems.some((item) => item.product === product._id));
  }, [wishlistItems, product._id]);

  const addToCartHandler = async (product, event) => {
    event.preventDefault();
    event.stopPropagation();
   
    if (!userToken) {
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

      const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};

      if (existItem) {
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
            productId: product._id,
          },
          {
            headers: headers,
          }
        );
      }

      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...product, quantity },
      });
      ctxDispatchW({ type: "CREATE_SUCCESS" });
      setNotification(`${product.name} was added to the cart`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      window.alert("Failed to add to cart. Please try again later.");
    }
  };

  const addToWishlist = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userToken) {
      alert(
        "You are not logged in. Please log in to add items to the wihslist."
      );
      return;
    }
    try {
      ctxDispatchW({ type: "CREATE_REQUEST" });
      const token = userToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

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

      fetchWishlistItems(token);
      ctxDispatchW({
        type: "WISHLIST_ADD_ITEM",
        payload: { ...item },
      });
      console.log(!isInWishlist);
      setIsInWishlist(true);
      ctxDispatchW({ type: "CREATE_SUCCESS" });
      setNotification(`${item.name} a fost adăugat în lista de favorite`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      ctxDispatchW({ type: "CREATE_FAIL" });
      console.error("Error adding to wishlist:", err);
      window.alert("Failed to add to wishlist. Please try again later.");
    }
  };

  const removeFromWishlist = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      ctxDispatchW({ type: "CREATE_REQUEST" });
      const token = userToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.delete(`/api/wishlist/${item._id}`, {
        headers: headers,
      });
      console.log("Deleted from wishlist:", item._id);
      fetchWishlistItems(token);
      ctxDispatchW({ type: "WISHLIST_REMOVE_ITEM", payload: item });
      setIsInWishlist(false); // Set isInWishlist to false locally
      ctxDispatchW({ type: "CREATE_SUCCESS" });
      setNotification(`${item.name}a fost eliminat din lista de favorite`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      window.alert(
        "Failed to remove item from wishlist. Please try again later."
      );
    }
  };

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
               {product.price} de lei
            </Typography>
          </CardContent>

          <div className="actions-card">
            <IconButton
              onClick={(event) =>
                isInWishlist
                  ? removeFromWishlist(product, event)
                  : addToWishlist(product, event)
              }
              aria-label="Add to Wishlist"
              // color={wishlistItems[product._id] ? "secondary" : "default"}
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
                  fontFamily: "Montserrat, sans-serif",
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
      {selectedProduct && <ProductDetails userToken={userToken}/>}
    </div>
  );
}

export default Product;

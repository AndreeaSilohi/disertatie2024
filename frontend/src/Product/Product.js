import React, { useState, useContext } from "react";
// import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import { WishlistContext } from "../WishListContextProvider";
import ProductDetails from "../ProductDetails/ProductDetails";
import { ShoppingCartSimple } from "phosphor-react";
import { Store } from "../Store";
import Button from "@mui/material/Button";
import axios from "axios";
import "./Product.css";
function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (data.stoc < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });

    setNotification(`${data.name} a fost adaugat in wishlist`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const { wishListItems, addToWishlist } = useContext(WishlistContext);
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToWishlist = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!wishListItems[productId]) {
      addToWishlist(productId);
      setNotification(`${productId} a fost adaugat in wishlist`);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      <Link className="product-link" to={`/product/${product.slug}`} key={product.name}>
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
            <CardContent>
              <Typography className="typografy-name"gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography  className="typografy-price"  color="text.secondary">
                Pret: {product.price} de lei
              </Typography>
            </CardContent>
         
          <div className="actions-card">
            <IconButton
              onClick={(event) => handleAddToWishlist(product._id, event)}
              aria-label="Add to Wishlist"
              color={wishListItems[product._id] ? "secondary" : "default"}
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

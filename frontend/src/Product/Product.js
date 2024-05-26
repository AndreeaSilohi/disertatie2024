import React, { useState, useContext, useEffect, useRef } from 'react';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Store } from '../Store';
import { Wishlist } from '../W';
import RatingComponent from '../Rating/RatingComponent';
import './Product.css';

function Product(props) {
  const navigate = useNavigate();
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
    try {
      const { data } = await axios.get('/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      ctxDispatchW({
        type: 'WISHLIST_SET_ITEMS',
        payload: data.wishlistItems,
      });
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    }
  };

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [notification, setNotification] = useState('');
  const [notificationWarning, setNotificationWarning] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setIsInWishlist(wishlistItems.some((item) => item.product === product._id));
  }, [wishlistItems, product._id]);

  const addToCartHandler = async (product, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userToken) {
      setNotificationWarning(
        'Nu ești logat. Loghează-te pentru a adăuga produse în coș'
      );
      setTimeout(() => {
        setNotificationWarning('');
        navigate('/signin');
      }, 2000);
      return;
    }

    try {
      const { data } = await axios.get(`/api/products/${product._id}`);
      const existItem = cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      if (data.stoc < quantity) {
        setNotification('Produsul are stocul epuizat');
        setTimeout(() => {
          setNotification('');
        }, 3000);
        return;
      }

      const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};

      if (existItem) {
        await axios.put(
          `/api/cart/${existItem._id}`,
          { quantity: quantity, stoc: product.stoc },
          { headers: headers }
        );
      } else {
        await axios.post(
          '/api/cart',
          {
            quantity: quantity,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            productId: product._id,
            stoc: product.stoc,
          },
          {
            headers: headers,
          }
        );
      }

      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity },
      });
      setNotification(`${product.name} a fost adăugat în coș`);
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      window.alert('Failed to add to cart. Please try again later.');
    }
  };

  const addToWishlist = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userToken) {
      setNotificationWarning(
        'Nu ești logat. Loghează-te pentru a adăuga produse în lista de favorite'
      );
      setTimeout(() => {
        setNotificationWarning('');
        navigate('/signin');
      }, 2000);
      return;
    }
    try {
      ctxDispatchW({ type: 'CREATE_REQUEST' });
      const token = userToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(
        '/api/wishlist',
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
        type: 'WISHLIST_ADD_ITEM',
        payload: { ...item },
      });
      setIsInWishlist(true);
      ctxDispatchW({ type: 'CREATE_SUCCESS' });
      setNotification(`${item.name} a fost adăugat în lista de favorite`);
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (err) {
      ctxDispatchW({ type: 'CREATE_FAIL' });
      console.error('Error adding to wishlist:', err);
      window.alert('Failed to add to wishlist. Please try again later.');
    }
  };

  const removeFromWishlist = async (item, event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      ctxDispatchW({ type: 'CREATE_REQUEST' });
      const token = userToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.delete(`/api/wishlist/${item._id}`, {
        headers: headers,
      });

      fetchWishlistItems(token);
      ctxDispatchW({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
      setIsInWishlist(false);
      ctxDispatchW({ type: 'CREATE_SUCCESS' });
      setNotification(`${item.name} a fost eliminat din lista de favorite`);
      setTimeout(() => {
        setNotification('');
      }, 3000);
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      window.alert(
        'Failed to remove item from wishlist. Please try again later.'
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
            paddingBottom: '25px',
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
              sx={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {product.name}
            </Typography>
            <Typography
              className="typografy-price"
              color="text.secondary"
              sx={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {product.price} lei
            </Typography>
            <RatingComponent
              rating={product.rating}
              numReviews={product.numReviews}
            />
          </CardContent>

          <div className="actions-card">
            <IconButton
              onClick={(event) =>
                isInWishlist
                  ? removeFromWishlist(product, event)
                  : addToWishlist(product, event)
              }
              aria-label="Add to Wishlist"
              color={isInWishlist ? 'secondary' : 'default'}
              sx={{ marginRight: '8px' }}
            >
              <FavoriteIcon />
            </IconButton>
            {product.stoc === 0 ? (
              <Button variant="contained" disabled>
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
                }}
                onClick={(event) => addToCartHandler(product, event)}
              >
                Adaugă în coș
              </Button>
            )}
          </div>
        </div>
      </Link>
      {notification && <div className="notification">{notification}</div>}
      {notificationWarning && (
        <div className="notificationWarning">{notificationWarning}</div>
      )}
      {selectedProduct && <ProductDetails userToken={userToken} />}
    </div>
  );
}

export default Product;

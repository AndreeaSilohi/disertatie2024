import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Grid,
} from '@mui/material';
import CheckoutSteps from '../CheckoutSteps/CheckoutSteps';
import { Store } from '../Store';
import LoadingBox from '../LoadingBox';
import './PlaceOrder.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function PlaceOrder() {
  const navigate = useNavigate();
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.2345=>123.23

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice >=100 ? round2(0) : round2(10);

  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = round2(cart.itemsPrice + cart.shippingPrice);


  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // Reduce stock quantity for each product in the cart
      for (const item of cart.cartItems) {
        console.log(item);
        await axios.put(`/api/products/${item.slug}/reduceStock`, {
          quantity: item.quantity,
        });
      }
      await axios.delete('/api/cart', {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      window.alert(err);
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div className="container-place-order">
      <div className="image-background">
        <div className="background-picture">
          <div className="center-all">
            <div className="checkout-steps-place-order">
              <CheckoutSteps step1 step2 step3 step4 />
            </div>
            <div className="place-order-content">
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card className="adresa-livrare">
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '25px',
                        }}
                      >
                        Adresă livrare
                      </Typography>
                      <List>
                        <ListItem>
                          <p style={{ fontSize: '18px',margin:"0px" }}>
                            {cart.shippingAddress.fullName}
                          </p>
                        </ListItem>
                        <ListItem>
                          <p style={{ fontSize: '18px',margin:"0px" }}>
                            {' '}
                            {cart.shippingAddress.address},{' '}
                            {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode},{' '}
                            {cart.shippingAddress.country}
                          </p>
                        </ListItem>
                      </List>
                      <RouterLink className="router-link" to="/shipping">
                        Editează
                      </RouterLink>
                    </CardContent>
                  </Card>

                  <Card className="mb-3" style={{ marginTop: '40px' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '25px',
                        }}
                      >
                        Metodă de plată
                      </Typography>
                      <List>
                        <ListItem>
                          {/* <strong>Metodă: </strong> */}
                          <p style={{ fontSize: '18px' }}>
                            {cart.paymentMethod}
                          </p>
                        </ListItem>
                      </List>
                      <RouterLink className="router-link" to="/payment">
                        Editează
                      </RouterLink>
                    </CardContent>
                  </Card>

                  <Card className="mb-3" style={{ marginTop: '40px' }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '25px',
                        }}
                      >
                        {' '}
                        Produse comandă{' '}
                      </Typography>
                      <List>
                        {cart.cartItems.map((item) => (
                          <ListItem key={item._id}>
                            <Grid container alignItems="center">
                              <Grid item>
                                <div className="img-name">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="grid-img"
                                  />
                                  <RouterLink
                                    style={{
                                      fontSize: '18px',
                                      width: '220px',
                                    }}
                                    to={`/product/${item.slug}`}
                                    className="router-name"
                                  >
                                    {item.name}
                                  </RouterLink>
                                  <p className="quantity-price">
                                    {item.quantity}
                                  </p>
                                  <p className="quantity-price">
                                    {item.price} lei
                                  </p>
                                </div>
                              </Grid>
                            </Grid>
                          </ListItem>
                        ))}
                      </List>
                      <RouterLink className="router-link" to="/cart">
                        Editează
                      </RouterLink>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="order-summary">
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '25px',
                        }}
                      >
                        Sumar comandă
                      </Typography>
                      <List>
                        <ListItem>
                          <Grid
                            container
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Grid item xs>
                              {' '}
                              Cost produse
                            </Grid>
                            <Grid item xs>
                              {cart.itemsPrice} lei
                            </Grid>
                          </Grid>
                        </ListItem>
                        <ListItem>
                          <Grid
                            container
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Grid item xs>
                              Livrare
                            </Grid>
                            <Grid item xs>
                              {cart.shippingPrice} lei
                            </Grid>
                          </Grid>
                        </ListItem>
                        <ListItem>
                          <Grid
                            container
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Grid item xs>
                              <strong style={{ fontSize: '18px' }}>
                                Totalul comenzii
                              </strong>
                            </Grid>
                            <Grid item xs>
                              <strong>{cart.totalPrice} lei</strong>
                            </Grid>
                          </Grid>
                        </ListItem>

                        <ListItem>
                          <Grid container>
                            <Button
                              sx={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontSize: '15px',
                                textTransform: 'uppercase',
                                color: 'white',
                                backgroundColor: '#FFA500',
                                width: '400px',
                              }}
                              type="button"
                              onClick={placeOrderHandler}
                              disabled={cart.cartItems.length === 0}
                            >
                              Finalizează comanda
                            </Button>
                          </Grid>
                          {loading && <LoadingBox />}
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

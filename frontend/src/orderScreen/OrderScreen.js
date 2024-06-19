import React, { useContext, useEffect, useReducer,useState } from 'react';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import { Store } from '../Store';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import './OrderScreen.css';
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Grid,
} from '@mui/material';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };

    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'FETCH_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const [notification, setNotification] = useState(null);

  const { id: orderId } = params;
  const navigate = useNavigate();
  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        setNotification({
          type: 'success',
          message: 'Plată efectuată cu succes',
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        window.alert(getError(err));
      }
    });
  }

  function onError(err) {
    window.alert(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (!userInfo) {
      return navigate('/login');
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }

      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'EUR',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      // window.alert('Order is delivered!');
      setNotification({
        type: 'success',
        message: 'Status schimbat cu succes!',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container-order">
      <div className="order-content">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className="mb-3">
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: '25px',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Informații client
                </Typography>
                <List>
                  <ListItem style={{padding:"0px 0px 0px 16px"}}>
                    <strong>Nume: &nbsp;</strong>
                    <p>{order.shippingAddress.fullName}</p>
                  </ListItem>
                  <ListItem style={{padding:"0px 0px 0px 16px"}}>
                    <strong>Adresă: </strong>
                    <p>
                      &nbsp;
                      {order.shippingAddress.address},{' '}
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode},{' '}
                      {order.shippingAddress.country}
                    </p>
                  </ListItem>
                  <ListItem style={{padding:"0px 0px 0px 16px"}}>
                    <strong>Telefon: </strong>
                    <p>
                      &nbsp;
                      {order.shippingAddress.telephone}
                    </p>
                  </ListItem>
                  {order.isDelivered ? (
                    <MessageBox variant="success">
                      Livrat la data de {formatDate(order.deliveredAt.substring(0, 10))}.
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">
                      Comanda nu este încă livrată.
                    </MessageBox>
                  )}
                </List>
              </CardContent>
            </Card>

            <Card className="mb-3" style={{ marginTop: '40px' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: '25px',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Plată
                </Typography>
                <List>
                  <ListItem>
                    <strong>Metodă de plată: &nbsp;</strong>
                    <p>{order.paymentMethod}</p>
                  </ListItem>
                  {order.isPaid ? (
                    <MessageBox variant="success">
                      Plătită la data de {formatDate(order.paidAt.substring(0, 10))}.
                    </MessageBox>
                  ) : (
                    <MessageBox variant="danger">Neplătită</MessageBox>
                  )}
                </List>
              </CardContent>
            </Card>

            <Card className="mb-3" style={{ marginTop: '40px' }}>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: '25px',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Produse
                </Typography>
                <List>
                  {order.orderItems.map((item) => (
                    <ListItem key={item._id}>
                      <Grid container alignItems="center">
                        <Grid item>
                          <div className="div-img-order-screen">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="grid-img-order-screen"
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

                            <p className="quantity-price">{item.quantity}</p>
                            <p className="quantity-price">{item.price} lei</p>
                          </div>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="order-pay">
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '25px',
                  }}
                >
                  Totalul comenzii
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
                        Produse
                      </Grid>
                      <Grid item xs>
                        {order.itemsPrice} lei
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs>
                        Livrare
                      </Grid>
                      <Grid item xs>
                        {order.shippingPrice}&nbsp;lei
                      </Grid>
                    </Grid>
                  </ListItem>
                  {/* <ListItem>
                    <Grid container>
                      <Grid item xs>
                        Tax
                      </Grid>
                      <Grid item xs>
                        {order.taxPrice}lei
                      </Grid>
                    </Grid>
                  </ListItem> */}
                  <ListItem>
                    <Grid container>
                      <Grid item xs>
                        <strong>Totalul comenzii</strong>
                      </Grid>
                      <Grid item xs>
                        <strong>{order.totalPrice}&nbsp;LEI</strong>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {!order.isPaid && order.paymentMethod !== 'Cash' && (
                    <ListItem
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isPending ? (
                        <LoadingBox />
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}
                    </ListItem>
                  )}

                  {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListItem>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      <div>
                        <Button type="button" onClick={deliverOrderHandler}>
                          Livrează comanda
                        </Button>
                      </div>
                    </ListItem>
                  )}

    
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

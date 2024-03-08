import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Grid,
} from "@mui/material";

import CheckoutSteps from "../CheckoutSteps/CheckoutSteps";
import Navbar from "../navbar/Navbar";
import { Store } from "../Store";
import LoadingBox from "../LoadingBox";
import "./PlaceOrder.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
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

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);

  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/orders",
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
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({type:'CREATE_SUCCESS'});
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      window.alert(err);
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div className="container-place-order">
      <div className="navbar-place-order">
        <Navbar />
      </div>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="place-order-content">
        <h1>Preview Order</h1>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card className="mb-3">
              <CardContent>
                <Typography variant="h6">Shipping</Typography>
                <List>
                  <ListItem>
                    <strong>Name: </strong>
                    <p>{cart.shippingAddress.fullName}</p>
                  </ListItem>
                  <ListItem>
                    <strong>Address: </strong>
                    <p>
                      {" "}
                      {cart.shippingAddress.address},{" "}
                      {cart.shippingAddress.city},{" "}
                      {cart.shippingAddress.postalCode},{" "}
                      {cart.shippingAddress.country}
                    </p>
                  </ListItem>
                </List>
                <RouterLink to="/shipping">Edit</RouterLink>
              </CardContent>
            </Card>

            <Card className="mb-3" style={{ marginTop: "40px" }}>
              <CardContent>
                <Typography variant="h6">Payment</Typography>
                <List>
                  <ListItem>
                    <strong>Method: </strong>
                    <p>{cart.paymentMethod}</p>
                  </ListItem>
                </List>
                <RouterLink to="/payment">Edit</RouterLink>
              </CardContent>
            </Card>

            <Card className="mb-3" style={{ marginTop: "40px" }}>
              <CardContent>
                <Typography variant="h6">Items</Typography>
                <List>
                  {cart.cartItems.map((item) => (
                    <ListItem key={item._id}>
                      <Grid container alignItems="center">
                        <Grid item xs={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          />
                          <RouterLink to={`/product/${item.slug}`}>
                            {item.name}
                          </RouterLink>
                        </Grid>
                        <Grid item xs={3}>
                          <span>{item.quantity}</span>
                        </Grid>
                        <Grid item xs={3}>
                          ${item.price}
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
                <RouterLink to="/cart">Edit</RouterLink>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Order Summary</Typography>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs>
                        Items
                      </Grid>
                      <Grid item xs>
                        {cart.itemsPrice} lei 
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs>
                        Shipping
                      </Grid>
                      <Grid item xs>
                        {cart.shippingPrice} lei
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs>
                        Tax
                      </Grid>
                      <Grid item xs>
                        {cart.taxPrice} lei
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs>
                        <strong> Order Total</strong>
                      </Grid>
                      <Grid item xs>
                        <strong>{cart.totalPrice} lei</strong>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justifyContent="center">
                      <Button
                        sx={{
                          fontFamily: "Catamaran, sans-serif",
                          fontSize: "15px",
                          textTransform: "uppercase",
                          color: "black",
                          backgroundColor: "#d77e2b",
                          width: "400px",
                        }}
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        Place Order
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
  );
}

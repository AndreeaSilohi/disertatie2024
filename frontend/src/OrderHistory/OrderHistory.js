import React, { useContext, useEffect, useReducer } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { getError } from "../utils";
import axios from "axios";

import Navbar from "../navbar/Navbar";

import "./OrderHistory.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="container-order">
      <div className="navbar-place-order">
        <Navbar />
      </div>
      <div className="order-history-content">
        <h1>Order History</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>DATE</TableCell>
                  <TableCell>TOTAL</TableCell>
                  <TableCell>PAID</TableCell>
                  <TableCell>DELIVERED</TableCell>
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {String(order.createdAt).substring(0, 10)}
                    </TableCell>
                    <TableCell>{order.totalPrice}</TableCell>
                    <TableCell>
                      {order.isPaid
                        ? String(order.paidAt).substring(0, 10)
                        : "No"}
                    </TableCell>

                    <TableCell>
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : "No"}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        onClick={() => {
                          navigate(`/order/${order._id}`);
                        }}
                        sx={{
                          fontFamily: "Catamaran, sans-serif",
                          fontSize: "15px",
                          textTransform: "uppercase",
                          color: "black",
                          backgroundColor: "#d77e2b",
                          width: "100px",
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

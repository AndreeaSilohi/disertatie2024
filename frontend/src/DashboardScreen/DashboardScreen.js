import React, { useEffect, useReducer, useContext } from "react";
import { Store } from "../Store";
import Navbar from "../navbar/Navbar";
import LoadingBox from "../LoadingBox";
import { getError } from "../utils";
import axios from "axios";
import MessageBox from "../MessageBox";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material"; // Assuming you're using Material-UI components

import Chart from "react-google-charts";
import "./DashboardScreen.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="container-dashboard">
      <div className="navbar-shipping">
        <Navbar />
      </div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="card-container">
            <Card className="card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {summary.users && summary.users[0]
                    ? summary.users[0].numUsers
                    : 0}
                </Typography>

                <Typography color="text.secondary">Users</Typography>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {summary.orders && summary.users[0]
                    ? summary.orders[0].numOrders
                    : 0}
                </Typography>

                <Typography color="text.secondary">Orders</Typography>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {summary.orders && summary.users[0]
                    ? summary.orders[0].totalSales.toFixed(2)
                    : 0}{" "}
                  lei
                </Typography>

                <Typography color="text.secondary">Orders</Typography>
              </CardContent>
            </Card>
          </div>
          <div className="charts">
            <h2>Sales chart</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox> No sale</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading chart...</div>}
                data={[
                  ["Date", "Sales"],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>

          <div className="charts">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox> No category</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading chart...</div>}
                data={[
                  ["Category", "Products"],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}

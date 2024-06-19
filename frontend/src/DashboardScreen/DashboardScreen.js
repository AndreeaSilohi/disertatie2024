import React, { useEffect, useReducer, useContext } from 'react';
import { Store } from '../Store';
import Navbar from '../navbar/Navbar';
import LoadingBox from '../LoadingBox';
import { getError } from '../utils';
import axios from 'axios';
import MessageBox from '../MessageBox';
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from '@mui/material'; // Assuming you're using Material-UI components

import Chart from 'react-google-charts';
import './DashboardScreen.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };
  
  return (
    <div className="container-dashboard">
      <p className="title-dashboard">Monitorizare vânzări</p>
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

                <Typography color="text.secondary">Utilizatori</Typography>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {summary.orders && summary.users[0]
                    ? summary.orders[0].numOrders
                    : 0}
                </Typography>

                <Typography color="text.secondary">Comenzi</Typography>
              </CardContent>
            </Card>

            <Card className="card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {summary.orders && summary.users[0]
                    // ? summary.orders[0].totalSales.toFixed(2)
                    ? summary.orders[0].totalSales
                    : 0}{' '}
                  lei
                </Typography>

                <Typography color="text.secondary">Total încasări</Typography>
              </CardContent>
            </Card>
          </div>

          <div className="charts">
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>Nicio comandă</MessageBox>
            ) : (
              <Chart
                style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}
                width="1000px"
                height="500px"
                chartType="AreaChart"
                loader={<div>Loading chart...</div>}
                data={[
                  ['Date', 'Vânzări'],
                  ...summary.dailyOrders.map((x) => [formatDate(x._id), x.sales]),
                ]}
                options={{
                  title: 'Monitorizarea vânzărilor',
                  titleTextStyle: {
                    fontSize: 20,
                    bold: true,
                    textAlign: 'center',
                    margin: 50,
                  },
                  hAxis: {
                    title: 'Data',
                    titleTextStyle: {
                      fontSize: 16,
                      bold: true,
                    },
                  },
                  vAxis: {
                    title: 'Vânzări în lei',
                    titleTextStyle: {
                      fontSize: 16,
                      bold: true,
                    },
                  },
                }}
              ></Chart>
            )}
          </div>

          <div className="charts">
            {summary.productCategories.length === 0 ? (
              <MessageBox>Nicio categorie</MessageBox>
            ) : (
              <Chart
                style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}
                width="1000px"
                height="500px"
                chartType="PieChart"
                loader={<div>Loading chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
                options={{
                  title: 'Categorii de produse',
                  titleTextStyle: {
                    fontSize: 20,
                    bold: true,
                    textAlign: 'center',
                  },
                }}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}

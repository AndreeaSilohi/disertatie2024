import React from 'react';
import { getError } from '../utils';
import Navbar from '../navbar/Navbar';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import { Store } from '../Store';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer } from 'react';

import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(215, 126, 43)',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
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
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        window.alert('Order deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        window.alert(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  return (
    <div className="container-order">
      <div className="order-history-content">
        <h1>Orders</h1>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell align="center" className="table-cell">
                    ID
                  </StyledTableCell> */}
                  <StyledTableCell align="center" className="table-cell">
                    UTILIZATOR
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    DATA
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    TOTAL
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    PLĂTITĂ
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    LIVRATĂ{' '}
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    ACȚIUNI
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => (
                  <StyledTableRow key={order._id}>
                    {/* <StyledTableCell>{order._id}</StyledTableCell> */}
                    <StyledTableCell align="center">
                      {order.user ? order.user.name : 'DELETED USER'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {order.createdAt.substring(0, 10)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {order.totalPrice}&nbsp;lei
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {order.isDelivered ? order.deliveredAt : 'No'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        Details
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => deleteHandler(order)}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

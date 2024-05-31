import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  tableCellClasses,
  TableHead,
  TableRow,
} from '@mui/material';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import './OrderHistory.css';
import Pagination from '@mui/material/Pagination';

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
        orders: action.payload.orders,
        loading: false,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, orders, page, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
    page: 1,
    pages: 1,
  });

  const pageSize = 10; 

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/mine?page=${page}&pageSize=${pageSize}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        console.error('Error fetching orders:', getError(error)); 
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo, page]);

  const handlePageChange = (event, value) => {
    dispatch({ type: 'FETCH_REQUEST' });
    dispatch({ type: 'FETCH_SUCCESS', payload: { orders: [], page: value, pages } });
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <div className="container-order">
      <div className="order-history-content">
        <h1 className="title-history">Istoric comenzi</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <>
            <TableContainer className="table-container" component={Paper}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
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
                      LIVRATĂ
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      ACȚIUNI
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <StyledTableRow key={order._id}>
                      <StyledTableCell align="center" className="table-cell">
                        {/* {String(order.createdAt).substring(0, 10)} */}
                        {formatDate(order.createdAt)}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="table-cell">
                        {order.totalPrice}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="table-cell">
                        {order.isPaid
                          ? String(order.paidAt).substring(0, 10)
                          : 'Nu'}
                      </StyledTableCell>

                      <StyledTableCell align="center" className="table-cell">
                        {order.isDelivered
                          ? order.deliveredAt.substring(0, 10)
                          : 'Nu'}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="table-cell">
                        <Button
                          type="button"
                          variant="outlined"
                          sx={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '15px',
                            textTransform: 'uppercase',
                            color: 'rgb(215, 126, 43)',
                            borderColor: 'rgb(215, 126, 43)',
                            padding: '5px',
                            marginRight: '5px',
                            fontSize: '12px',
                          }}
                          onClick={() => {
                            navigate(`/order/${order._id}`);
                          }}
                        >
                          Detalii
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              className="pagination-prd"
              count={pages}
              page={page}
              onChange={handlePageChange}
              sx={{ '& .Mui-selected': { color: '#FFA500' } }}
            />
          </>
        )}
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useReducer } from 'react';
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
      return { ...state, orders: action.payload, loading: false };
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

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="container-order">
      <div className="order-history-content">
        <h1 className="title-history">Istoric comenzi</h1>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <TableContainer className="table-container" component={Paper}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  {/* <TableCell>ID</TableCell> */}
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
                    {/* <TableCell>{order._id}</TableCell> */}
                    <StyledTableCell align="center" className="table-cell">
                      {String(order.createdAt).substring(0, 10)}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {order.totalPrice}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {order.isPaid
                        ? String(order.paidAt).substring(0, 10)
                        : 'No'}
                    </StyledTableCell>

                    <StyledTableCell align="center" className="table-cell">
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : 'No'}
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
        )}
      </div>
    </div>
  );
}

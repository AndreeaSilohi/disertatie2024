import React, { useState } from 'react';
import './OrderListScreen.css';
import { getError } from '../utils';
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
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
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
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true, selectedOrder: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false, selectedOrder: null };

    default:
      return state;
  }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    {
      loading,
      error,
      orders,
      loadingDelete,
      openCreateDialog,
      successDelete,
      selectedOrder,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    selectedOrder: null,
    openCreateDialog: false,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data.orders });
        setTotalPages(data.totalPages);
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
  }, [userInfo, successDelete, page]);

  const deleteOrder = async (order) => {
    setDeletingOrder(order);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (deletingOrder) {
      deleteHandler(deletingOrder);
    }
    setConfirmDelete(false);
  };
  const deleteHandler = async (order) => {
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/orders/${order._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      setNotification('Comanda a fost ștearsă cu succes');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      window.alert(getError(error));
      dispatch({
        type: 'DELETE_FAIL',
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <div className="container-orders">
      <div className="order-history-content">
        <h1 className="title-orders">Comenzi</h1>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <TableContainer className="table-container" component={Paper}>
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
                    <StyledTableCell align="center" className="table-cell">
                      {order.user ? order.user.name : 'DELETED USER'}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {order.createdAt.substring(0, 10)}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {order.totalPrice}&nbsp;lei
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {order.isDelivered ? order.deliveredAt : 'No'}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      <Button
                        className="button-actions"
                        type="button"
                        variant="outlined"
                        style={{
                          color: 'rgb(215, 126, 43)',
                          borderColor: 'rgb(215, 126, 43)',
                          padding: '5px',
                          marginRight: '5px',
                          fontSize: '12px',
                        }}
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        Detalii
                      </Button>
                      &nbsp;
                      <Button
                        className="button-actions"
                        type="button"
                        variant="outlined"
                        style={{
                          color: 'red',
                          borderColor: 'red',
                          padding: '5px',
                          marginRight: '5px',
                          fontSize: '12px',
                        }}
                        onClick={() => deleteOrder(order)}
                      >
                        Șterge
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Pagination
          className="pagination-prd"
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ '& .Mui-selected': { color: '#FFA500' } }}
        />
        <ConfirmationDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmare ștergere"
          message="Ești sigur că vrei să ștergi această comandă?"
        />
        {notification && (
          <div className="notification-delete-order">{notification}</div>
        )}
      </div>
    </div>
  );
}

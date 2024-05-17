import React, { useState, useContext, useEffect, useReducer } from 'react';
import './UserListScreen.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import axios from 'axios';
import UserEditScreen from '../UserEditScreen/UserEditScreen';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
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
        users: action.payload,
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
      return { ...state, modalOpen: true, selectedUser: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false, selectedUser: null };

    default:
      return state;
  }
};
export default function UserListScreen() {
  const navigate = useNavigate();
  const [
    {
      loading,
      error,
      users,
      loadingDelete,
      openCreateDialog,
      successDelete,
      modalOpen,
      selectedUser,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    modalOpen: false,
    selectedUser: null,
    openCreateDialog: false,
  
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users?page=${currentPage}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data.users });
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
  }, [userInfo, successDelete, currentPage]);

  const deleteUser = async (user) => {
    setDeletingUser(user);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteHandler(deletingUser);
    }
    setConfirmDelete(false);
  };
  const deleteHandler = async (user) => {
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      setNotification('Utilizatorul a fost sters cu succes');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      window.alert(getError(error));

      dispatch({ type: 'DELELE_FAIL' });
    }
  };

  const updateUserList = async () => {
    try {
      const { data } = await axios.get(`/api/users`, {
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

  const openEditModal = (user) => {
    dispatch({ type: 'OPEN_MODAL', payload: user._id });
  };

  const closeEditModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update currentPage when page changes
  };
  return (
    <div className="container-users">
      <div className="order-history-content">
        <h1 className="title-users">Utilizatori</h1>
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
                  {/* <StyledTableCell>ID</StyledTableCell> */}
                  <StyledTableCell align="center" className="table-cell">
                    NUME
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    EMAIL
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    ADMIN
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    ACȚIUNI
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user) => (
                  <StyledTableRow key={user._id}>
                    {/* <StyledTableCell>{user._id}</StyledTableCell> */}
                    <StyledTableCell align="center" className="table-cell">
                      {user.name}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {user.email}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {user.isAdmin ? 'DA' : 'NU'}
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
                        onClick={() => openEditModal(user)}
                        // onClick={() => navigate(`/admin/user/${user._id}`)}
                      >
                        Editează
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
                        onClick={() => deleteUser(user)}
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
          count={totalPages} // Total number of pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Function to handle page change
          sx={{ '& .Mui-selected': { color: '#FFA500' } }}
        />
        {modalOpen && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeEditModal}>
                &times;
              </span>
              <UserEditScreen
                userId={selectedUser}
                updateUserList={updateUserList}
                onClose={closeEditModal}
              />
            </div>
          </div>
        )}
        <ConfirmationDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmare ștergere"
          message="Ești sigur că vrei să ștergi acest utilizator?"
        />
        {notification && (
          <div className="notification-delete-user">{notification}</div>
        )}
      </div>
    </div>
  );
}

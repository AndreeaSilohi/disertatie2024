import React, { useContext, useEffect, useReducer } from "react";
import './UserListScreen.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};
export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users`, {
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        window.alert("User deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        window.alert(getError(error));

        dispatch({ type: "DELELE_FAIL" });
      }
    }
  };


  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
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
          <TableContainer  className="table-container" component={Paper}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell>ID</StyledTableCell> */}
                  <StyledTableCell align="center" className="table-cell">NUME</StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">EMAIL</StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">ADMIN</StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">ACȚIUNI</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user) => (
                  <StyledTableRow key={user._id}>
                    {/* <StyledTableCell>{user._id}</StyledTableCell> */}
                    <StyledTableCell align="center" className="table-cell">{user.name}</StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">{user.email}</StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">{user.isAdmin ? "YES" : "NO"}</StyledTableCell>

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
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                      >
                        Edit
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
                        onClick={() => deleteHandler(user)}
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

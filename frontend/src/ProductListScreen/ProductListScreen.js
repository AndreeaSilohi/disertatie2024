import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import './ProductListScreen.css';
import { getError } from '../utils';
import CreateProduct from '../CreateProduct/CreateProduct';
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
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
        openCreateDialog: false,
      };

    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products], // Add the new product to the beginning of the products array
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'OPEN_CREATE_DIALOG':
      return { ...state, openCreateDialog: true }; // Open the create product dialog
    case 'CLOSE_CREATE_DIALOG':
      return { ...state, openCreateDialog: false }; // Close the create product dialog

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      openCreateDialog,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    openCreateDialog: false,
  });
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = () => {
    dispatch({ type: 'CREATE_REQUEST' });
    dispatch({ type: 'OPEN_CREATE_DIALOG' }); // Open the create product dialog
  };

  const closeCreateDialog = () => {
    dispatch({ type: 'CLOSE_CREATE_DIALOG' }); // Close the create product dialog
  };

  const submitCreateForm = async (productData) => {
    try {
      const { data } = await axios.post('/api/products', productData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      window.alert('Product created successfully');
      dispatch({ type: 'CREATE_SUCCESS' });
      dispatch({ type: 'ADD_PRODUCT', payload: data.product });
      navigate(`/admin/products`);
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        window.alert('Product delete successfully');
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
    <div className="container-products">
      <div className="order-history-content">
        <h1 className="title-products">Produse</h1>
        <div className="div-button-create">
          <Button
            className="button-create"
            onClick={createHandler}
            variant="outlined"
            style={{
              color: '#2E7D32',
              borderColor: '#2E7D32',
              padding: '5px',
            }}
          >
            Create product
          </Button>
        </div>
        {/* {loadingCreate && <LoadingBox></LoadingBox>} */}
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
                  {/* <StyledTableCell className="table-cell">ID</StyledTableCell> */}
                  <StyledTableCell align="center" className="table-cell">
                    NUME
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    PREȚ
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    CATEGORIE
                  </StyledTableCell>
                  <StyledTableCell align="center" className="table-cell">
                    ACȚIUNI
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((product) => (
                  <StyledTableRow key={product._id}>
                    {/* <StyledTableCell>{product._id}</StyledTableCell> */}
                    <StyledTableCell align="center" className="table-cell">
                      {String(product.name)}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {product.price}&nbsp;lei
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      {product.category}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="table-cell">
                      <Button
                        className="button-actions"
                        variant="outlined"
                        type="button"
                        style={{
                          color: '#2E7D32',
                          borderColor: '#2E7D32',
                          padding: '5px',
                          marginRight: '5px',
                          fontSize: '12px',
                        }}
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        className="button-actions"
                        variant="outlined"
                        type="button"
                        style={{
                          color: 'red',
                          borderColor: 'red',
                          padding: '5px',
                          marginRight: '5px',
                          fontSize: '12px',
                        }}
                        onClick={() => deleteHandler(product)}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>

            <div className="pagination">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                  to={`/admin/products?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          </TableContainer>
        )}
        <CreateProduct
          open={openCreateDialog}
          onClose={closeCreateDialog}
          onSubmit={submitCreateForm}
        />
      </div>
    </div>
  );
}

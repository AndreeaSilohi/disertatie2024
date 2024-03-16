import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Store } from "../Store";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import Navbar from "../navbar/Navbar";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "./ProductListScreen.css";
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
  
      default:
        return state;
    }
  };
  
  export default function ProductListScreen() {
    const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
      loading: true,
      error: '',
    });
  
    const { search, pathname } = useLocation();
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
      fetchData();
    }, [page, userInfo]);
  return (
    <div className="container-order">
      <div className="navbar-place-order">
        <Navbar />
      </div>
      <div className="order-history-content">
        <h1>Products</h1>
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
                  <TableCell>NAME</TableCell>
                  <TableCell>PRICE</TableCell>
                  <TableCell>CATEGORY</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product._id}</TableCell>
                    <TableCell>
                      {String(product.name)}
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="pagination">
            {[...Array(pages).keys()].map((x) => (
              <Button
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Button>
            ))}
          </div>



          {/* <div className={styles.pagination}>
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </Link>
                ))}
              </div> */}
          </TableContainer>
        )}


      </div>
    </div>
  );
}

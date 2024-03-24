import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Store } from "../Store";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import "./ProductListScreen.css";
import { getError } from "../utils";
import CreateProduct from "../CreateProduct/CreateProduct";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";


const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
        openCreateDialog: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    case "OPEN_CREATE_DIALOG":
      return { ...state, openCreateDialog: true }; // Open the create product dialog
    case "CLOSE_CREATE_DIALOG":
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
    error: "",
    openCreateDialog: false,
  });
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = () => {
    dispatch({ type: "CREATE_REQUEST" });
    dispatch({ type: "OPEN_CREATE_DIALOG" }); // Open the create product dialog
  };

  const closeCreateDialog = () => {
    dispatch({ type: "CLOSE_CREATE_DIALOG" }); // Close the create product dialog
  };

  const submitCreateForm = async (productData) => {
    try {
      const { data } = await axios.post("/api/products", productData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      window.alert("Product created successfully");
      dispatch({ type: "CREATE_SUCCESS" });
      //navigate(`/admin/product/${data.product._id}`);
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        window.alert("Product delete successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        window.alert(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div className="container-order">
      <div className="navbar-place-order">
        <Navbar />
      </div>
      <div className="order-history-content">
        <h1>Products</h1>
        <div>
          <Button onClick={createHandler}>Create product</Button>
        </div>
        {loadingCreate && <LoadingBox></LoadingBox>}
        {loadingDelete && <LoadingBox></LoadingBox>}
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
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product._id}</TableCell>
                    <TableCell>{String(product.name)}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="light"
                        onClick={() => deleteHandler(product)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="pagination">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
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

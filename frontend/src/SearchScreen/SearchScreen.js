import React, { useEffect, useState, useReducer } from "react";
import { getError } from "../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import { XCircle } from "phosphor-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Grid, Typography, Select, MenuItem } from "@mui/material";
import Product from "../Product/Product";

import "./SearchScreen.css";

const styles = {
  navbarShipping: "navbar-shipping",
  title: "title",
  departmentContainer: "department-container",
  priceContainer: "price-container",
  reviewContainer: "review-container",
  productGrid: "product-grid",
  pagination: "pagination",
};

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
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        window.alert(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;

    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <div className={styles.navbarShipping}>
        <Navbar />
      </div>
      <title className={styles.title}>Search Products</title>

      <Grid container spacing={3} className="grid1">
        <Grid item md={3} className="gridD">
          <Typography variant="h5" className={styles.title}>
            Department
          </Typography>
          <ul className={styles.departmentContainer}>
            <li>
              <Link
                className={"all" === category ? "text-bold" : ""}
                to={getFilterUrl({ category: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  className={c === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: c })}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
          <Typography variant="h5" className={styles.title}>
            Price
          </Typography>
          <ul className={styles.priceContainer}>
            <li>
              <Link
                className={"all" === price ? "text-bold" : ""}
                to={getFilterUrl({ price: "all" })}
              >
                Any
              </Link>
            </li>

            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  to={getFilterUrl({ price: p.value })}
                  className={p.value === price ? "text-bold" : ""}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
          <Typography variant="h5" className={styles.title}>
            Avg. Customer Review
          </Typography>
          <ul className={styles.reviewContainer}>
            {ratings.map((r) => (
              <li key={r.name}>
                <Link
                  to={getFilterUrl({ rating: r.rating })}
                  className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                >
                  {/* <Rating caption={" & up"} rating={r.rating}></Rating> */}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={getFilterUrl({ rating: "all" })}
                className={rating === "all" ? "text-bold" : ""}
              >
                {/* <Rating caption={" & up"} rating={0}></Rating> */}
              </Link>
            </li>
          </ul>
        </Grid>

        <Grid item md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Grid container justifyContent="space-between" mb={3}>
                <Grid item md={6}>
                  <div>
                    {countProducts === 0 ? "No" : countProducts} Results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : Price " + price}
                    {rating !== "all" && " : Rating " + rating + " & up"}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <XCircle size={28} />
                      </Button>
                    ) : null}
                  </div>
                </Grid>
                <Grid item className="text-end">
                  Sort by{" "}
                  <Select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <MenuItem value="newest">Newest Arrivals</MenuItem>
                    <MenuItem value="lowest">Price: Low to High</MenuItem>
                    <MenuItem value="highest">Price: High to Low</MenuItem>
                    <MenuItem value="toprated">Avg. Customer Reviews</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Grid container className={styles.productGrid} >
                {products.map((product) => (
                  <Grid item sm={6} lg={6} key={product._id}>
                    <Product product={product}></Product>
                  </Grid>
                ))}
              </Grid>

              <div className={styles.pagination}>
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: "/search",
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </Link>
                ))}
              </div>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

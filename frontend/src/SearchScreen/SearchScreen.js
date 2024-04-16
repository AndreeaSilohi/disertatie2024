import React, { useEffect, useState, useReducer,useContext } from "react";
import { getError } from "../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import { XCircle, Warning } from "phosphor-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Grid, Typography, Select, MenuItem } from "@mui/material";

import Product from "../Product/Product";
import SearchBox from "../SearchBox/SearchBox";
import Divider from "@mui/material/Divider";
import { Store } from "../Store";
import "./SearchScreen.css";

import RatingComponent from "../Rating/RatingComponent";

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
    name: "1 leu - 50 lei",
    value: "1-50",
  },
  {
    name: "51 lei - 200lei",
    value: "51-200",
  },
  {
    name: "201 lei - 1000 lei",
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
  const { state: { userInfo } } = useContext(Store);
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
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
  
          const { data } = await axios.get(
            `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`,
            config
          );
  
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({
            type: 'FETCH_FAIL',
            payload: getError(err),
          });
        }
      };
  
      fetchData();
    }, [category, order, page, price, query, rating]);
    //    }, [category, order, page, price, query, rating, userInfo.token]); OLD

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
      <header className="header-shop">
        <div className="background-container-shop">
          <div className="overlay-text-shop">
            <h1 className="h1-title-shop">OUR SHOP</h1>
          </div>
        </div>
      </header>
      <div className="sort-grid">
        <div>
          <SearchBox />
        </div>
        <div className="sort-select">
          <Grid item className="text-end">
            Sort by{" "}
            <Select
              sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "17px" }}
              value={order}
              onChange={(e) => {
                navigate(getFilterUrl({ order: e.target.value }));
              }}
            >
              <MenuItem
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "17px" }}
                className="sort-select"
                value="newest"
              >
                Newest Arrivals
              </MenuItem>
              <MenuItem
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "17px" }}
                className="sort-select"
                value="lowest"
              >
                Price: Low to High
              </MenuItem>
              <MenuItem
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "17px" }}
                className="sort-select"
                value="highest"
              >
                Price: High to Low
              </MenuItem>
              <MenuItem
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "17px" }}
                className="sort-select"
                value="toprated"
              >
                Avg. Customer Reviews
              </MenuItem>
            </Select>
          </Grid>
        </div>
      </div>

      <Grid container spacing={3} className="grid1">
        <Grid item md={3} className="gridD">
          <Typography variant="h5" className={styles.title}>
            Categorii
          </Typography>
          <ul className={styles.departmentContainer}>
            <li>
              <Link
                className={"all" === category ? "text-bold" : ""}
                to={getFilterUrl({ category: "all" })}
              >
                Toate
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
          <Divider />
          <Typography variant="h5" className={styles.title}>
            Pret
          </Typography>
          <ul className={styles.priceContainer}>
            <li>
              <Link
                className={"all" === price ? "text-bold" : ""}
                to={getFilterUrl({ price: "all" })}
              >
                Toate
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
          <Divider />
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
                  <RatingComponent caption={" & up"} rating={r.rating}></RatingComponent>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={getFilterUrl({ rating: "all" })}
                className={rating === "all" ? "text-bold" : ""}
              >
                <RatingComponent caption={" & up"} rating={0}></RatingComponent>
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
                <Grid item md={12}>
                  <div className="results">
                    <div className="results-content">
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
                  </div>
                </Grid>
              </Grid>
              {products.length === 0 && (
                <div className="empty-product">
                  <div className="empty-product-content">
                    <Warning size={32} />
                    <h1>NO PRODUCTS FOUND</h1>
                  </div>
                </div>
              )}

              <Grid container className={styles.productGrid}>
                {products.map((product) => (
                  <Grid item sm={6} lg={6} key={product._id}>
                    <Product product={product} userToken={userInfo.token}></Product>
                  </Grid>
                ))}
              </Grid>

              <div className={styles.pagination}>
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
              </div>
            
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
//GET FILTER URL DE VERIFICAT!
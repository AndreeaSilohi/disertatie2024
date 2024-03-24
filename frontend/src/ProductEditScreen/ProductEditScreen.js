import "./ProductEditScreen.css";
import React, { useContext, useReducer, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../utils";
import MessageBox from "../MessageBox";
import LoadingBox from "../LoadingBox";
import axios from "axios";
import Navbar from "../navbar/Navbar";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stoc, setStoc] = useState("");
  const [description, setDescription] = useState("");
  const [additional, setAdditional] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setImage(data.image);
        setPrice(data.price);
        setCategory(data.category);
        setStoc(data.stoc);
        setDescription(data.description);
        setAdditional(data.additional);
        dispatch({ type: "FETCH_SUCCESS" });
        console.log(data);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          category,
          stoc,
          description,
          additional,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      window.alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      window.alert("Image uploaded successfully");
      setImage(data.secure_url);
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };
  return (
    <div className="edit-screen-container">
      <div>
        <Navbar />
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="product-edit-form">
          <h1>Edit product </h1>
          <form onSubmit={submitHandler} className="form-alignment">
            <div className="form-product-edit-content">
              <input
                className="input-field"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="input-field"
                name="slug"
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <input
                className="input-field"
                name="image"
                placeholder="Image"
                fullWidth
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <input
                type="file"
                id="imageFile"
                label="Choose Image"
                onChange={uploadFileHandler}
              />
              {loadingUpload && <LoadingBox></LoadingBox>}
              <input
                className="input-field"
                name="price"
                placeholder="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                className="input-field"
                name="category"
                placeholder="Category"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <input
                className="input-field"
                name="stoc"
                placeholder="Stoc"
                fullWidth
                value={stoc}
                onChange={(e) => setStoc(e.target.value)}
              />

              <input
                className="input-field"
                name="description"
                placeholder="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="input-field"
                name="additional"
                placeholder="Additional informations"
                fullWidth
                value={additional}
                onChange={(e) => setAdditional(e.target.value)}
              />
              <div className="button input-box">
                <input type="submit" value="Submit" />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

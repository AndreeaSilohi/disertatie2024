import React, { useState,useContext,useReducer } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "./CreateProduct.css";
import { Store } from "../Store";
import axios from "axios";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOAD_NEW_REQUEST":
      return { ...state, loadingUploadNew: true, errorUploadNew: "" };
    case "UPLOAD_NEW_SUCCESS":
      return { ...state, loadingUploadNew: false, errorUploadNew: "" };
    case "UPLOAD_NEW_FAIL":
      return { ...state, loadingUploadNew: false, errorUploadNew: action.payload };
    default:
      return state;
  }
};

const CreateProduct = ({ open, onClose, onSubmit }) => {

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{  loadingUploadNew }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });



  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    image: "",
    price: "",
    category: "",
    stoc: "",
    rating: "",
    numReviews: "",
    description: "",
    additional: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(productData);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_NEW_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_NEW_SUCCESS" });
      window.alert("Image uploaded successfully");
      setProductData({ ...productData, image: data.secure_url });
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: "UPLOAD_NEW_FAIL", payload: getError(err) });
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          fontFamily: "Catamaran, sans-serif",
          fontSize: "25px",
          paddingTop: "30px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Create New Product
      </DialogTitle>

      <div className="dialog-content">
        <DialogContent>
          <input
            className="input-field"
            name="name"
            placeholder="Name"
            value={productData.name}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="slug"
            placeholder="Slug"
            value={productData.slug}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="image"
            placeholder="Image"
            fullWidth
            value={productData.image}
            onChange={handleChange}
          />

          <input
            type="file"
            id="imageFile"
            label="Choose Image"
            onChange={uploadFileHandler}
          />
          <input
            className="input-field"
            name="price"
            placeholder="Price"
            type="number"
            fullWidth
            value={productData.price}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="category"
            placeholder="Category"
            fullWidth
            value={productData.category}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="stoc"
            placeholder="Stoc"
            fullWidth
            value={productData.stoc}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="rating"
            placeholder="Rating"
            fullWidth
            value={productData.rating}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="numReviews"
            placeholder="Number of Reviews"
            fullWidth
            value={productData.numReviews}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="description"
            placeholder="Description"
            fullWidth
            value={productData.description}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="additional"
            placeholder="Additional informations"
            fullWidth
            value={productData.additional}
            onChange={handleChange}
          />
        </DialogContent>
      </div>

      <DialogActions>
        <Button
          type="button"
          onClick={onClose}
          sx={{
            backgroundColor: "red",
            color: "black",
            fontFamily: "Catamaran, sans-serif",
            fontSize: "15px",
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "green",
            color: "black",
            fontFamily: "Catamaran, sans-serif",
            fontSize: "15px",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProduct;

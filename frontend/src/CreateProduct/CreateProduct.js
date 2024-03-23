import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const CreateProduct = ({ open, onClose, onSubmit }) => {
  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    image: "",
    price: 0,
    category: "",
    stoc: 0,
    rating: 0,
    numReviews: 0,
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Product</DialogTitle>
      <DialogContent>
        <input
          name="name"
          label="Name"
          fullWidth
          value={productData.name}
          onChange={handleChange}
        />
        <TextField
          name="slug"
          label="Slug"
          fullWidth
          value={productData.slug}
          onChange={handleChange}
        />
        <TextField
          name="image"
          label="Image"
          fullWidth
          value={productData.image}
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          fullWidth
          value={productData.price}
          onChange={handleChange}
        />
        <TextField
          name="category"
          label="Category"
          fullWidth
          value={productData.category}
          onChange={handleChange}
        />
        <TextField
          name="stoc"
          label="Stoc"
          fullWidth
          value={productData.stoc}
          onChange={handleChange}
        />
        <TextField
          name="rating"
          label="Rating"
          fullWidth
          value={productData.rating}
          onChange={handleChange}
        />
        <TextField
          name="numReviews"
          label="Number of Reviews"
          fullWidth
          value={productData.numReviews}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          value={productData.description}
          onChange={handleChange}
        />
        <TextField
          name="additional"
          label="additional"
          fullWidth
          value={productData.additional}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProduct;

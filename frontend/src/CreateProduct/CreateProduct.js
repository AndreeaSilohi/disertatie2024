import React, { useState, useContext, useReducer } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  DialogContentText,
  Typography,
  Box,
} from '@mui/material';

import { Upload } from 'phosphor-react';
import './CreateProduct.css';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPLOAD_NEW_REQUEST':
      return { ...state, loadingUploadNew: true, errorUploadNew: '' };
    case 'UPLOAD_NEW_SUCCESS':
      return { ...state, loadingUploadNew: false, errorUploadNew: '' };
    case 'UPLOAD_NEW_FAIL':
      return {
        ...state,
        loadingUploadNew: false,
        errorUploadNew: action.payload,
      };
    default:
      return state;
  }
};

const CreateProduct = ({ open, onClose, onSubmit }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loadingUploadNew }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [productData, setProductData] = useState({
    name: '',
    slug: '',
    image: '',
    price: '',
    category: '',
    stoc: '',
    rating: '0',
    numReviews: '0',
    description: '',
    additional: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(productData);
    setProductData({
      name: '',
      slug: '',
      image: '',
      price: '',
      category: '',
      stoc: '',
      rating: '0',
      numReviews: '0',
      description: '',
      additional: '',
    });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_NEW_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_NEW_SUCCESS' });
      window.alert('Image uploaded successfully');
      setProductData({ ...productData, image: data.secure_url });
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: 'UPLOAD_NEW_FAIL', payload: getError(err) });
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      {/* <DialogTitle
        sx={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '25px',
          paddingTop: '40px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Creare produs
      </DialogTitle> */}

      <div className="dialog-content">
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="name"
            name="name"
            label="Denumire produs"
            value={productData.name}
            onChange={handleChange}
            sx={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          <TextField
            fullWidth
            margin="normal"
            id="slug"
            name="slug"
            label="Slug"
            value={productData.slug}
            onChange={handleChange}
          />

          <label
            htmlFor="imageFile"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              marginTop: '15px',
            }}
          >
            <Upload size={26} style={{ marginRight: '2px' }} />
            <span className="span-menu">Încarcă fotografie</span>
          </label>
          <input
            type="file"
            id="imageFile"
            label="Alege imagine"
            onChange={uploadFileHandler}
            style={{ display: 'none' }}
          />

          {/* <label htmlFor="imageFile" style={{ cursor: 'pointer' }}>
            <Upload size={24} onChange={uploadFileHandler} />
          </label>
          <input
            type="file"
            id="imageFile"
            label="Alege imagine"
            onChange={uploadFileHandler}
          /> */}
          <TextField
            margin="dense"
            id="image"
            name="image"
            label="Link imagine"
            fullWidth
            value={productData.image}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            id="price"
            name="price"
            label="Preț"
            type="number"
            fullWidth
            inputProps={{ min: 1 }}
            value={productData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="category"
            name="category"
            label="Categorie"
            fullWidth
            value={productData.category}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="stoc"
            name="stoc"
            label="Stoc"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={productData.stoc}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="rating"
            name="rating"
            label="Rating"
            fullWidth
            value={productData.rating}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="numReviews"
            name="numReviews"
            label="Număr de recenzii"
            fullWidth
            value={productData.numReviews}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Descriere"
            fullWidth
            value={productData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="additional"
            name="additional"
            label="Informații adiționale"
            fullWidth
            value={productData.additional}
            onChange={handleChange}
          />

          {/* <input
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
          /> */}
        </DialogContent>
      </div>

      <div className="dialog-actions">
        <DialogActions>
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            sx={{
              color: 'red',
              borderColor: 'red',
              padding: '5px',
              marginRight: '5px',
              fontSize: '15px',
            }}
          >
            Cancel
          </Button>
          <Button
            className="button-actions"
            type="button"
            variant="outlined"
            onClick={handleSubmit}
            sx={{
              color: '#2E7D32',
              borderColor: '#2E7D32',
              padding: '5px',
              marginRight: '5px',
              fontSize: '15px',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default CreateProduct;

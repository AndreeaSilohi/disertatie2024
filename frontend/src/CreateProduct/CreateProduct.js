import React, { useState, useContext, useReducer } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
 
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

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleCategoryChange = (event) => {
    setProductData({ ...productData, category: event.target.value });
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
      // window.alert('Image uploaded successfully');
      setNotification({
        type: 'success',
        message: 'Imagine încărcată cu succes',
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      setProductData({ ...productData, image: data.secure_url });
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: 'UPLOAD_NEW_FAIL', payload: getError(err) });
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
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
            {/* <TextField
              fullWidth
              margin="normal"
              id="slug"
              name="slug"
              label="Slug"
              value={productData.slug}
              onChange={handleChange}
            /> */}

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
            {/* <TextField
              margin="dense"
              id="category"
              name="category"
              label="Categorie"
              fullWidth
              value={productData.category}
              onChange={handleChange}
            /> */}
             <FormControl fullWidth margin="dense">
              <InputLabel id="category-label">Categorie</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={productData.category}
                onChange={handleCategoryChange}
                label="Categorie"
                sx={{textAlign:"left"}}
              >
                <MenuItem value="Miere">Miere</MenuItem>
                <MenuItem value="Propolis">Propolis</MenuItem>
                <MenuItem value="Cremă">Cremă</MenuItem>
              </Select>
            </FormControl>


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
            {/* <TextField
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
            /> */}
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
          </DialogContent>
        </div>

        <div className="dialog-actions">
          <DialogActions>
            <Button
              className="button-actions"
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{
                color: 'red',
                padding: '5px',
                border: '1px solid red',
                marginRight: '5px',
                fontSize: '15px',
              }}
            >
              Renunță
            </Button>
            <Button
              className="button-actions"
              type="button"
              variant="outlined"
              onClick={handleSubmit}
              sx={{
                color: '#2E7D32',
                border: '1px solid #2E7D32',
                padding: '5px',
                marginRight: '5px',
                fontSize: '15px',
              }}
            >
              Salvează
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          {/* <button onClick={handleCloseNotification}>Close</button> */}
        </div>
      )}
    </div>
  );
};

export default CreateProduct;

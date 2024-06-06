import './ProductEditScreen.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React, { useContext, useReducer, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import MessageBox from '../MessageBox';
import LoadingBox from '../LoadingBox';
import axios from 'axios';
import { Button, TextField, Typography, Box } from '@mui/material';
import { Upload } from 'phosphor-react';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const handleToastClose = (event, reason) => {
    console.log('Closing toast:', toastSeverity, toastMessage, openToast);
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stoc, setStoc] = useState('');
  const [description, setDescription] = useState('');
  const [additional, setAdditional] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setImage(data.image);
        setPrice(data.price);
        setCategory(data.category);
        setStoc(data.stoc);
        setDescription(data.description);
        setAdditional(data.additional);
        dispatch({ type: 'FETCH_SUCCESS' });
        console.log(data);
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          // slug,
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
        type: 'UPDATE_SUCCESS',
      });
      // window.alert('Product updated successfully');
      setToastSeverity('success');
      setToastMessage('Produs încărcat cu succes');
      setOpenToast(true);
      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      // window.alert('Image uploaded successfully');

      setImage(data.secure_url);
    } catch (err) {
      window.alert(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  return (
    <div className="edit-screen-container">
      <div className="div-image-left">
        <img className="product-edit-image" alt="text" src={image}></img>
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="form-container">
          <div className="form-product-edit-content">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '40px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxWidth: 800,
                  mx: 'auto',
                  p: 2,
                  border: '1px solid  #000000',
                  borderRadius: '12px',
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  mb={2}
                  className="typography-title"
                  sx={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Editare informații produs
                </Typography>
                <form onSubmit={submitHandler}>
                  <TextField
                    sx={{ fontFamily: 'Montserrat, sans-serif !important' }}
                    fullWidth
                    margin="normal"
                    className="input-field"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {/* <TextField
                    fullWidth
                    margin="normal"
                    className="input-field"
                    name="slug"
                    placeholder="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
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
                    fullWidth
                    margin="normal"
                    label="Alege imagine"
                    onChange={uploadFileHandler}
                    style={{ display: 'none' }}
                  />
                  {loadingUpload && <LoadingBox></LoadingBox>}
                  <TextField
                    fullWidth
                    margin="normal"
                    className="input-field"
                    name="image"
                    placeholder="Image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />

                  <TextField
                    className="input-field"
                    name="price"
                    placeholder="Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <TextField
                    className="input-field"
                    name="category"
                    placeholder="Category"
                    fullWidth
                    margin="normal"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <TextField
                    className="input-field"
                    name="stoc"
                    placeholder="Stoc"
                    fullWidth
                    margin="normal"
                    value={stoc}
                    onChange={(e) => setStoc(e.target.value)}
                  />

                  <TextField
                    className="input-field"
                    name="description"
                    placeholder="Description"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    value={additional}
                    onChange={(e) => setAdditional(e.target.value)}
                    margin="normal"
                    className="input-field"
                    name="additional"
                    placeholder="Additional informations"
                  />
                  {/* <div className="button input-box">
                    <input type="submit" value="Submit" />
                  </div> */}

                  <div className="button-submit">
                    <Button
                      disabled={loading}
                      fullWidth
                      type="submit"
                      sx={{
                        mt: 2,
                        backgroundColor: '#064420',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#52616B',
                        },
                      }}
                    >
                      {loading ? 'Se salvează...' : 'Salvează'}
                    </Button>
                  </div>
                </form>
              </Box>
            </Box>
          </div>
        </div>
      )}
      <Snackbar
        className="snackbar-container"
        open={openToast}
        autoHideDuration={6000}
        onClose={handleToastClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleToastClose}
          severity={toastSeverity}
        >
          {toastMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

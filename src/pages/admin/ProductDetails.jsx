import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, selectProducts, selectLoading, selectError, fetchProducts } from '../../redux/slices/productSlice';
import { fetchCategories, selectCategories } from '../../redux/slices/categorySlice';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import axiosInstance from '../../utils/axiosInstance';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../../components/Dash/Sidebar';
import TopBar from '../../components/Dash/TopBar';
import { CssBaseline } from '@mui/material';


const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    available: false,
  });

  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    } else {
      const product = products.find((product) => product.id === id);
      if (product) {
        setProductDetails({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          categoryId: product.category[0].id,
          available: product.available,
        });
        setImages(product.images || []);
      }
    }
    dispatch(fetchCategories());
  }, [dispatch, id, products]);

  const handleChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const productData = {
        name: productDetails.name,
        description: productDetails.description,
        price: parseFloat(productDetails.price),
        quantity: parseInt(productDetails.quantity, 10),
        category: productDetails.categoryId,
      };
      await dispatch(updateProduct({ id, product: productData })).unwrap();
      setSnackbarMessage('Product updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to update product. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!newImage) {
      setSnackbarMessage('Please select an image to upload.');
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append('productId', id);
    formData.append('image', newImage);

    try {
        const token = localStorage.getItem('token');
      const response = await axiosInstance.post(`/admin/product-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setImages([...images, response.data]);
      setNewImage(null);
      setSnackbarMessage('Image uploaded successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to upload image. Please try again.');
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <TopBar />
        <Box
            mt={10}
            sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            }}
        >
            <Grid container spacing={3} sx={{ maxWidth: 1000 }}>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Box
                        sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        }}
                    >
                        <Typography variant="h6">Upload Product Images</Typography>
                        <Box
                            sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            }}
                        >
                            <input
                                accept="image/*"
                                type="file"
                                onChange={handleImageChange}
                                style={{ display: 'block' }}
                            />
                            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleImageUpload}>
                                Upload Image
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </Grid>
            <Grid item mt={5} xs={7}>
                <Box sx={{ }}>
                <Typography variant='h1' mb={3}>
                    Update Product
                </Typography>
                <TextField
                    label="Product Name"
                    name="name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={productDetails.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={productDetails.description}
                    onChange={handleChange}
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={productDetails.price}
                    onChange={handleChange}
                />
                <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={productDetails.quantity}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                    labelId="category-label"
                    id="categoryId"
                    name="categoryId"
                    value={productDetails.categoryId}
                    onChange={handleChange}
                    >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                        {category.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Update Product
                    </Button>
                </Box>
                </Box>
            </Grid>
            
            <Grid item mt={12} xs={5}>
                <Card variant="outlined" sx={{ p: 4 }}>
                <Typography variant="h5" mb={2}>
                    Uploaded Images
                </Typography>
                <Grid container spacing={2}>
                    {images.map((image) => (
                    <Grid item key={image.id}>
                        <Card>
                            <img src={`${process.env.REACT_APP_BACKEND_APP_API}/images/${image.url}`} alt="Product" width="155" height="120" />
                        </Card>
                    </Grid>
                    ))}
                </Grid>
                </Card>
            </Grid>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                />
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetails;

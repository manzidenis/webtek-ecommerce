import * as React from 'react';
import { CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, deleteProduct, selectProducts, selectLoading, selectError } from '../../redux/slices/productSlice';
import { fetchCategories, selectCategories } from '../../redux/slices/categorySlice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Dash/Sidebar';
import TopBar from '../../components/Dash/TopBar';

export default function ProductPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [newProduct, setNewProduct] = React.useState({ name: '', description: '', price: '', quantity: '', category: '', available: false });
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [deleteProductId, setDeleteProductId] = React.useState(null);

  React.useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleClickOpenDialog = () => {
    setNewProduct({ name: '', description: '', price: '', quantity: '', category: '', available: false });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.description && newProduct.price && newProduct.quantity) {
      try {
        const productData = {
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
          category: newProduct.category,
          available: newProduct.available,
        };
        await dispatch(addProduct(productData)).unwrap();
        setSnackbarMessage('Product added successfully!');
        setOpenSnackbar(true);
        handleCloseDialog();
      } catch (error) {
        setSnackbarMessage('Failed to add product. Please try again.');
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage('Please provide all details.');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      setSnackbarMessage('Product deleted successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to delete product. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleConfirmDelete = (id) => {
    setDeleteProductId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setDeleteProductId(null);
  };

  const handleConfirmDeleteProduct = () => {
    handleDeleteProduct(deleteProductId);
    handleCloseConfirmDialog();
  };

  const handleUpdateProduct = (id) => {
    navigate(`/dashboard/product/${id}`);
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
                <Typography variant="h6">Products</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpenDialog} sx={{ backgroundColor: '#4caf50', color: 'white', '&:hover': { backgroundColor: '#388e3c' } }}>
                  Add Product
                </Button>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.filter(product => product.available === true).map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.category.map((cat) => cat.name).join(', ')}</TableCell>
                      <TableCell>{product.available ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleUpdateProduct(product.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleConfirmDelete(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the details of the new product.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Product Name"
              type="text"
              fullWidth
              variant="standard"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <TextField
              margin="dense"
              id="price"
              label="Price"
              type="number"
              fullWidth
              variant="standard"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <TextField
              margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              variant="standard"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
            <Button onClick={handleConfirmDeleteProduct}>Delete</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Box>
    </Box>
  );
}

// src/App.js
import React from 'react';
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
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Sidebar from '../../components/Dash/Sidebar';
import TopBar from '../../components/Dash/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, deleteCategory, updateCategory, selectCategories, selectLoading, selectError } from '../../redux/slices/categorySlice';

function CategoryPage() {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
  
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [newCategory, setNewCategory] = React.useState({ name: '', image: null });
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = React.useState(null);
    const [editCategory, setEditCategory] = React.useState(null);
  
    React.useEffect(() => {
      dispatch(fetchCategories());
    }, [dispatch]);
  
    const handleClickOpenDialog = (category = null) => {
      if (category) {
        setNewCategory({ name: category.name, image: category.image });
        setEditCategory(category);
      } else {
        setNewCategory({ name: '', image: null });
        setEditCategory(null);
      }
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
      setNewCategory({ name: '', image: null });
      setEditCategory(null);
    };
  
    const handleSnackbarClose = () => {
      setOpenSnackbar(false);
    };
  
    const handleAddOrUpdateCategory = async () => {
      if (newCategory.name) {
        try {
          if (editCategory) {
            const categoryData = {
              name: newCategory.name,
              image: newCategory.image !== editCategory?.image ? newCategory.image : editCategory.image,
            };
            await dispatch(updateCategory({ id: editCategory.id, category: categoryData })).unwrap();
            setSnackbarMessage('Category updated successfully!');
          } else {
            const categoryDataAdd = new FormData();
            categoryDataAdd.append('name', newCategory.name);
            categoryDataAdd.append('image', newCategory.image);
            await dispatch(addCategory(categoryDataAdd)).unwrap();
            setSnackbarMessage('Category added successfully!');
          }
  
          setOpenSnackbar(true);
          setNewCategory({ name: '', image: null });
          handleCloseDialog();
        } catch (error) {
          setSnackbarMessage('Failed to add/update category. Please try again.');
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarMessage('Please provide all details.');
        setOpenSnackbar(true);
      }
    };
  
    const handleDeleteCategory = async (id) => {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        setSnackbarMessage('Category deleted successfully!');
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage('Category could not be deleted because it is being used by a product as a foreign key.');
        setOpenSnackbar(true);
      }
    };
  
    const handleConfirmDelete = (id) => {
      setDeleteCategoryId(id);
      setOpenConfirmDialog(true);
    };
  
    const handleCloseConfirmDialog = () => {
      setOpenConfirmDialog(false);
      setDeleteCategoryId(null);
    };
  
    const handleConfirmDeleteCategory = () => {
      handleDeleteCategory(deleteCategoryId);
      handleCloseConfirmDialog();
    };
  
    const handleFileChange = (event) => {
      setNewCategory({ ...newCategory, image: event.target.files[0] });
    };
  
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
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>Category</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleClickOpenDialog()}
                    sx={{ backgroundColor: '#4caf50', color: 'white', '&:hover': { backgroundColor: '#388e3c' } }}
                  >
                    Add Category
                  </Button>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              {loading && <Typography>Loading...</Typography>}
              {error && <Typography>Error: {error}</Typography>}
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                    <Card variant="outlined">
                      <Box p={0}>
                        <Box display="flex" justifyContent="center">
                          <img
                            src={`${process.env.REACT_APP_BACKEND_APP_API}/images/${category.image}`}
                            alt={category.name}
                            style={{ width: '100%', height: 100, objectFit: 'cover' }}
                          />
                        </Box>
                        <Typography variant="h4" component="div" fontWeight="bold" mb={0} mt={1}>Name: {category.name}</Typography>
                        <Typography variant="subtitle2">ID: {category.id}</Typography>
                        <Box mt={0} display="flex" justifyContent="center">
                          <IconButton aria-label="edit" color="primary" onClick={() => handleClickOpenDialog(category)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="delete" color="secondary" onClick={() => handleConfirmDelete(category.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
  
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs">
        <DialogTitle>{editCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Please enter the name of the {editCategory ? 'category' : 'new category'} and upload an image.</Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          {!editCategory && (
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span" sx={{ mt: 2 }}>
                  Upload Image
                </Button>
              </label>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateCategory} color="primary" variant="contained">
            {editCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} maxWidth="xs">
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Are you sure you want to delete this category?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteCategory} color="secondary" variant="contained">
            Delete
          </Button>
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
  
  export default CategoryPage;
  

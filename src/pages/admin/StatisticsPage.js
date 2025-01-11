import React, { useEffect } from 'react';
import { CssBaseline, Box, Grid, Paper, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectProducts, fetchProducts } from '../../redux/slices/productSlice';
import { selectOrders, fetchOrders } from '../../redux/slices/orderSlice';
import { selectCategories, fetchCategories } from '../../redux/slices/categorySlice';
import Sidebar from '../../components/Dash/Sidebar';
import TopBar from '../../components/Dash/TopBar';

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);
  const categories = useSelector(selectCategories);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Calculate statistics
  const totalProducts = products.filter(product => product.available === true).length;
  const totalOrders = orders.length;
  const totalCategories = categories.length;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <TopBar />
      <Box
        mt={10}
        p={3}
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#ff8a65', color: '#fff', height: '100%' }}>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{totalProducts}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#9575cd', color: '#fff', height: '100%' }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#4caf50', color: '#fff', height: '100%' }}>
              <Typography variant="h6">Total Categories</Typography>
              <Typography variant="h4">{totalCategories}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StatisticsPage;

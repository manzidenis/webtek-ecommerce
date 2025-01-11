import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchOrders, selectOrders, selectLoading, selectError } from '../../redux/userSlice/orderSlice';
import { Box, Typography, Card, CardContent, IconButton, Grid, CircularProgress, Snackbar, Modal, MenuItem, Select, FormControl, InputLabel, TextField, InputAdornment } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import UserHeader from 'components/Header';
import CssBaseline from '@mui/material/CssBaseline';
import dayjs from 'dayjs'; // For handling date formatting
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const OrderPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const location = useLocation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setSnackbarMessage(message);
      setOpenSnackbar(true);
    }
  }, [location]);

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    const { street, city, state, zipcode, country } = address;
    return `${street}, ${city}, ${state}, ${zipcode}, ${country}`;
  };

  const closeDetailsModal = () => {
    setSelectedOrder(null);
    setDetailsModalOpen(false);
  };

  const renderDetailsModal = () => {
    if (!selectedOrder) return null;
    return (
      <Modal open={detailsModalOpen} onClose={closeDetailsModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 800, borderRadius: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ borderBottom: 1, borderColor: 'grey.200', pb: 2 }}>
              User Details
            </Typography>
            <IconButton onClick={closeDetailsModal} sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Name: {selectedOrder.user.firstname} {selectedOrder.user.lastname}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Phone: {selectedOrder.user.phonenumber}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Address: {formatAddress({ street: 'kigabaga', city: 'Kigali', state: 'kimironko', zipcode: '250', country: 'Rwanda' })}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ borderBottom: 1, borderColor: 'grey.200', pb: 2, width: '100%', textAlign: 'center' }}>
              Order Products
            </Typography>
            <TableContainer sx={{ mt: 2, width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.orderProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>
                        <img
                          src={`${process.env.REACT_APP_BACKEND_APP_API}/images/${product.image}`}
                          alt={product.productName}
                          width="50"
                          style={{ borderRadius: 4 }}
                        />
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price} FRW</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          
        </Box>
      </Modal>
    );
  };

  const CollapsibleCard = ({ order }) => {
    return (
      <Card variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, height: 'auto' }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Order ID: {order.id}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Order Date: {dayjs(order.orderDate).format('DD-MM-YYYY')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Status: {order.status}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Amount: {order.amount} FRW
          </Typography>
        </CardContent>

        <Box sx={{ borderRadius: 2, backgroundColor: 'green', p: 0.2, mr: 1 }}>
          <IconButton aria-label="expand row" size="small" onClick={() => openDetailsModal(order)} sx={{ borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mr: 1, color: 'white' }}>View Details</Typography>
            <ExpandMoreIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Card>
    );
  };

  // Filter orders based on the status and date
  const filteredOrders = orders
    .filter(order => (statusFilter ? order.status === statusFilter : true))
    .filter(order => (dateFilter ? dayjs(order.orderDate).isSame(dayjs(dateFilter), 'day') : true));

  // Sort orders: PENDING first, then DELIVERED, and order by date (latest first)
  const sortedOrders = filteredOrders
    .sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      return dayjs(b.orderDate).isBefore(a.orderDate) ? 1 : -1;
    });

  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleDateChange = (e) => setDateFilter(e.target.value);

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
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <UserHeader />
        <Box mt={0} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={3} sx={{ maxWidth: 1000 }}>
            <Grid item xs={12}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', fontSize: '25px' }} mb={3}>
                  Orders
                </Typography>

                {/* Filter Options */}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        label="Status"
                        sx={{ height: 40 }}
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <TextField
                      label="Filter by Date"
                      type="date"
                      value={dateFilter}
                      onChange={handleDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      sx={{ height: 40 }}
                    />
                  </Grid>
                </Grid>

                {sortedOrders.slice(0, 5).map((order) => (
                  <CollapsibleCard key={order.id} order={order} />
                ))}

                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={() => setOpenSnackbar(false)}
                  message={snackbarMessage}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        {renderDetailsModal()}
      </Box>
    </React.Fragment>
  );
};

export default OrderPage;

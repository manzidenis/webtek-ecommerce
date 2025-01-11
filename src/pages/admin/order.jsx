import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus, selectOrders, selectLoading, selectError } from '../../redux/slices/orderSlice';
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  IconButton,
  Modal,
  Grid,
  CardContent,
  Card,
  CssBaseline,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from '../../components/Dash/Sidebar';
import TopBar from '../../components/Dash/TopBar';
import dayjs from 'dayjs';

const OrderPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      setSnackbarMessage('Order status updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to update order status. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    const { street, city, state, zipcode, country } = address;
    return `${street}, ${city}, ${state}, ${zipcode}, ${country}`;
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={() => handleStatusChange(selectedOrder.id, 'PENDING')}
              variant='contained'
              color="primary"
              sx={{ mr: 2, backgroundColor: 'orange' }}
            >
              Pending
            </Button>
            <Button
              onClick={() => handleStatusChange(selectedOrder.id, 'SHIPPED')}
              variant='contained'
              color="primary"
              sx={{ mr: 2, backgroundColor: 'blue' }}
            >
              Shipped
            </Button>
            <Button
              onClick={() => handleStatusChange(selectedOrder.id, 'DELIVERED')}
              variant='contained'
              color="primary"
              sx={{ mr: 2, backgroundColor: 'green' }}
            >
              Delivered
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };

  const CollapsibleCard = ({ order }) => {
    return (
      <Card variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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

  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    const dateMatch = dateFilter ? dayjs(order.orderDate).format('YYYY-MM-DD') === dateFilter : true;
    return statusMatch && dateMatch;
  });

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
            <Box sx={{ p: 3 }}>
              <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', fontSize: '25px' }} mb={3}>
                Orders
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControl sx={{ mr: 2, minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="SHIPPED">Shipped</MenuItem>
                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  label="Filter by Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>

              {filteredOrders.map((order) => (
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
  );
};

export default OrderPage;

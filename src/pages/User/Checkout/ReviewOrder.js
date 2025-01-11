// src/components/Checkout/ReviewOrder.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Grid } from '@mui/material';

const ReviewOrder = ({ handleBack, handlePlaceOrder, shippingAddress, paymentInfo }) => {
  const { cart } = useSelector(state => state.cart);

  const totalAmount = cart.items.filter(item => item.product.available === true).reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2} sx={{fontSize: '22px', fontWeight: 'bold'}} gutterBottom>Review Order</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}} gutterBottom>Shipping Address</Typography>
        <Typography>{`${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}, ${shippingAddress.country}`}</Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}} gutterBottom>Payment Information</Typography>
        <Typography>Card Number: **** **** **** {paymentInfo.cardNumber.slice(-4)}</Typography>
        <Typography>Expiry Date: {paymentInfo.expiryDate}</Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}} gutterBottom>Order Items</Typography>
        <Grid container spacing={2}>
          {cart.items.filter(item => item.product.available === true).map((item) => (
            <Grid item key={item.product.id} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: 2 }}>
                <img
                  src={item.product.images.length > 0 ? `${process.env.REACT_APP_BACKEND_APP_API}/images/${item.product.images[0].url}` : 'https://via.placeholder.com/150'}
                  alt={item.product.name}
                  width="100"
                  height="100"
                  style={{ objectFit: 'cover', marginRight: 16 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}} noWrap>{item.product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                   Frw {item.product.price} x {item.quantity}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}} gutterBottom>Total Amount</Typography>
        <Typography variant="h5">Frw {totalAmount.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleBack} sx={{ mr: 2 }}>Back</Button>
        <Button variant="contained" color="primary" onClick={handlePlaceOrder}>Place Order</Button>
      </Box>
    </Box>
  );
};

export default ReviewOrder;

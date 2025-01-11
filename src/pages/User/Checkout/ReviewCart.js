// src/components/Checkout/ReviewCart.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Grid } from '@mui/material';

const ReviewCart = ({ handleNext }) => {
  const { cart } = useSelector(state => state.cart);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Review Cart Items</Typography>
      <Grid container spacing={3}>
        {cart.items.filter(item => item.product.available === true).map((item) => (
          <Grid item key={item.product.id} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: 2 }}>
              <img
                src={item.product.images.length > 0 ? `${process.env.REACT_APP_BACKEND_APP_API}/images/${item.product.images[0].url}` : 'https://via.placeholder.com/100'}
                alt={item.product.name}
                width="100"
                height="100"
                style={{ objectFit: 'cover', marginRight: 16 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  ${item.product.price} x {item.quantity}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                  Total: ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleNext} size="large">
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewCart;

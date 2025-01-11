// src/components/Checkout/Checkout.js
import React, { useState } from 'react';
import ReviewCart from './ReviewCart';
import ShippingAddress from './ShippingAddress';
import CssBaseline from '@mui/material/CssBaseline';
import PaymentInfo from './PaymentInfo';
import ReviewOrder from './ReviewOrder';
import Header from 'components/Header';
import { Box, Container, Stepper, Step, StepLabel, Snackbar } from '@mui/material';
import axiosInstance from '../../../utils/axiosInstance'; // Adjust the path to your axios instance
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart } from '../../../redux/userSlice/cartSlice';

const steps = ['Review Cart', 'Shipping Address', 'Payment Information', 'Review and Confirm'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { cart } = useSelector(state => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderAmount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

      // Step 1: Create the order
      const createOrderResponse = await axiosInstance.post('/user/orders/create', {
        amount: orderAmount
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const orderId = createOrderResponse.data.id;

      // Step 2: Add products to the order
      await Promise.all(cart.items.map(async (item) => {
        await axiosInstance.post(`/user/orders/${orderId}/products/add`, {
          productId: item.product.id,
          quantity: item.quantity
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }));

      await Promise.all(cart.items.map(async (item) => {
        dispatch(removeFromCart({ cartId: cart.id, item }));
      }));
      
      // Redirect to the orders page
      navigate('/orders?message=Order placed successfully');
    } catch (error) {
      console.error('Failed to place order:', error.response ? error.response.data : error.message);
      setSnackbar({ open: true, message: 'Failed to place order' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Box>
          <Header />
        </Box>
        <Container sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: 100,
              overflowY: 'scroll',
              marginTop:5
            }}>
          <Box sx={{ my: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && <ReviewCart handleNext={handleNext} />}
            {activeStep === 1 && <ShippingAddress handleNext={handleNext} handleBack={handleBack} setShippingAddress={setShippingAddress} />}
            {activeStep === 2 && <PaymentInfo handleNext={handleNext} handleBack={handleBack} setPaymentInfo={setPaymentInfo} />}
            {activeStep === 3 && <ReviewOrder handleBack={handleBack} handlePlaceOrder={handlePlaceOrder} shippingAddress={shippingAddress} paymentInfo={paymentInfo} />}
          </Box>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbar.message}
          />
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default Checkout;

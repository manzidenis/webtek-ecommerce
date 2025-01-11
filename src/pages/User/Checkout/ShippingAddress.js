// src/components/Checkout/ShippingAddress.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Snackbar } from '@mui/material';
import { fetchAddresses } from '../../../redux/userSlice/addressSlice';
import { useNavigate } from 'react-router-dom';

const ShippingAddress = ({ handleNext, handleBack, setShippingAddress }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses, loading, error } = useSelector(state => state.addresses);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleNextStep = () => {
    if (!selectedAddress) {
      setSnackbarMessage('Please select an address or add a new address.');
      setSnackbarOpen(true);
      return;
    }
    const address = addresses.find(addr => addr.id === selectedAddress);
    setShippingAddress(address);
    handleNext();
  };

  const handleAddNewAddress = () => {
    navigate('/address');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Shipping Address</Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Select Address</InputLabel>
        <Select value={selectedAddress} onChange={handleAddressChange}>
          <MenuItem value="" disabled>
            Select an address
          </MenuItem>
          {addresses.map((address) => (
            <MenuItem key={address.id} value={address.id}>
              {`${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleBack} sx={{ mr: 2 }}>Back</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextStep}
          sx={{ mr: 2 }}
        >
          Next
        </Button>
        <Button variant="contained" color="secondary" onClick={handleAddNewAddress}>Add New Address</Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ShippingAddress;

// src/components/Checkout/PaymentInfo.js
import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid } from '@mui/material';

const PaymentInfo = ({ handleNext, handleBack, setPaymentInfo }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleNextStep = () => {
    const paymentData = { cardNumber, expiryDate, cvv };
    setPaymentInfo(paymentData);
    handleNext();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Payment Information</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              maxLength: 16,
              pattern: "\\d{16}",
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            variant="outlined"
            placeholder="MM/YY"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              maxLength: 5,
              pattern: "\\d{2}/\\d{2}",
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            variant="outlined"
            placeholder="123"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              maxLength: 3,
              pattern: "\\d{3}",
            }}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={handleBack} sx={{ mr: 2 }}>Back</Button>
        <Button variant="contained" color="primary" onClick={handleNextStep}>Next</Button>
      </Box>
    </Box>
  );
};

export default PaymentInfo;

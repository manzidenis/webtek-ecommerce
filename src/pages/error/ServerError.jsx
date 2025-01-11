import React from 'react';
import { Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ServerError = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        p: 3,
        bgcolor: '#f0f0f0',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
        500 - Internal Server Error
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Oops! Something went wrong on our server.
      </Typography>
    </Box>
  );
};

export default ServerError;

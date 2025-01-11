import React from 'react';
import { Typography, Box} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const AccessDenied = () => {
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
      <LockIcon sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
        Access Denied
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Sorry, you do not have permission to view this page.
      </Typography>
    </Box>
  );
};

export default AccessDenied;

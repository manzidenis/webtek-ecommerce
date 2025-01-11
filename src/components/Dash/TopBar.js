// src/components/TopBar.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const TopBar = () => {
  return (

    <AppBar>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <IconButton color="inherit" href="/dashboard/profile">
          <AccountCircle />
        </IconButton>
        <Button color="inherit" component={Link} to="/dashboard/logout">Logout</Button>
      </Toolbar>
    </AppBar>

  );
};

export default TopBar;

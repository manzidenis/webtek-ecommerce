import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Box, Avatar } from '@mui/material';
import { Link } from 'react-router-dom'; 
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { selectUser } from '../../redux/slices/userSlice';
import { useSelector } from 'react-redux';

const drawerWidth = 240;

const Sidebar = () => {
  const user = useSelector(selectUser);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 60, height: 60, mb: 2 }} src={`${process.env.REACT_APP_BACKEND_APP_API}/images/${user.profileImage}`} alt={user.firstName} />
        <Typography variant="h6">{`${user.firstname} ${user.lastname}`}</Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon><BarChartIcon /></ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/categories">
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary="Product Category" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/products">
          <ListItemIcon><LocalMallIcon /></ListItemIcon>
          <ListItemText primary="Product" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/orders">
          <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

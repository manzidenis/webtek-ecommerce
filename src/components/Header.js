import React, {useState} from 'react';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
// components
import Logo from './Logo';
import {
  flexBetweenCenter,
  dFlex,
  displayOnDesktop,
} from 'themes/commonStyles';
import MobileSearch from './Search';
import Profile from './Profile';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartDropdown from './Cart';

const Header = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const cart = useSelector(state => state.cart);

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        ...dFlex,
        minHeight: 70,
        borderBottom: '1px solid #ddd',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            ...flexBetweenCenter,
            minHeight: 90,
            px: 4,
          }}
        >
          <Box sx={displayOnDesktop}>
            <Logo />
          </Box>
          <Box>
            <MobileSearch />
          </Box>
          <Box sx={displayOnDesktop}>
            <Box
              sx={{display: 'flex'}}
            >
              <IconButton color="inherit" onClick={handleCartClick} sx={{marginRight: 2}}>
                <Badge badgeContent={cart.cart.items.filter(item => item.product.available === true).length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Profile />
            </Box>
          </Box>
        </Box>
      </Container>
      <CartDropdown anchorEl={anchorEl} handleClose={handleCartClose} />
    </Box>
  );
};

export default Header;

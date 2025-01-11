// src/components/CartDropdown.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Card, CardMedia, Typography, IconButton, Popover, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart, updateCartQuantity, fetchCart } from '../redux/userSlice/cartSlice';

const CartCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const CartDropdown = ({ anchorEl, handleClose }) => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector(state => state.cart);
  console.log(cart);
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart({ cartId: cart.id, item }));
  };

  const handleUpdateQuantity = (item, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ cartId: cart.id, item, quantity }));
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            maxHeight: '400px', // Set maximum height for the dropdown
            overflow: 'auto', // Enable scrolling
          },
        }}
      >
        <Box sx={{ p: 2, width: 300, position: 'relative' }}>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {cart.items.filter(item => item.product.available === true).length > 0 ? (
            cart.items.filter(item => item.product.available === true).map((item) => (
              <CartCard key={item.product.id}>
                <CardMedia
                  component="img"
                  alt={item.product.name}
                  sx={{ width: 80, height: 80, objectFit: 'cover', marginRight: 2 }}
                  image={item.product.images.length > 0 ? `${process.env.REACT_APP_BACKEND_APP_API}/images/${item.product.images[0].url}` : 'https://via.placeholder.com/150'}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" noWrap>{item.product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    ${item.product.price} x {item.quantity}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <IconButton color="primary" onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>
                      <AddIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton color="primary" onClick={() => handleUpdateQuantity(item, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleRemoveFromCart(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CartCard>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              Your cart is empty.
            </Typography>
          )}
          <Box sx={{ position: 'sticky', bottom: 0, background: 'white', pt: 2 }}>
            <Button
              variant="contained"
              href="/checkout"
              color="primary"
              fullWidth
              onClick={handleClose}
              disabled={cart.items.filter(item => item.product.available === true).length === 0} // Disable button if cart is empty
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default CartDropdown;

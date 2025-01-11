import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MobileStepper from '@mui/material/MobileStepper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

// mui icons
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// 3rd party
import SwipeableViews from 'react-swipeable-views';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { fetchProducts } from '../redux/userSlice/productSlice';
import { addToCart, fetchCart, updateCartQuantity } from '../redux/userSlice/cartSlice';
import { useSelector, useDispatch } from 'react-redux';

import {
  flexBetween,
  carouselDot,
  carouselImage,
  fixedBottom,
} from 'themes/commonStyles';
import './CarouselCard.css';


const CarouselCard = ({ product }) => {

  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.cart);
  
  const [activeStep, setActiveStep] = React.useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCart());
  }, [dispatch]);

  const maxSteps = product.images.length; // so that we know how many dots

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1); // jumps when we click the next arrow
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1); // when we click the back arrow
  };

  const handleStepChange = (step) => {
    setActiveStep(step); // handle swipe change
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddToCart = (product) => {
    if (cart.id) {
      const existingItem = cart.items.find(item => item.product.id === product.id);
      if (existingItem) {
        const quantity = existingItem.quantity + 1;
        // If product exists in the cart, update its quantity
        dispatch(updateCartQuantity({ cartId: cart.id, item: existingItem, quantity }));
        setSnackbarMessage('Product quantity updated in cart');
      } else {
        // If product does not exist in the cart, add it as a new item
        dispatch(addToCart({ cartId: cart.id, product, quantity: 1 }));
        setSnackbarMessage('Product added to cart');
      }
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      className="carouselCard"
      sx={{
        flexGrow: 1,
        position: 'relative',
      }}
    >
    {product.images.length && (
        <SwipeableViews
          axis={'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {product.images.map((step, index) => {
            return (
              <div key={step.id}>
                <Box
                  component="img"
                  sx={carouselImage}
                  src={`${process.env.REACT_APP_BACKEND_APP_API}/images/${step.url}`}
                  alt={step.id}
                ></Box>
              </div>
            );
          })}
        </SwipeableViews>
      )}

      <Box sx={fixedBottom}>
        <MobileStepper
          sx={{ backgroundColor: 'transparent' }}
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              sx={carouselDot}
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              sx={carouselDot}
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
            </Button>
          }
        />
      </Box>

      <Box sx={flexBetween}>
          <Box sx={{ mt: 0 }}>
            <Link href={`/product/${product.id}`} sx={{margin:0}}>
                <Typography component="h1" sx={{fontWeight: 900}}> {product.name}</Typography>
                <Typography component="p" sx={{margin: 0}}>Frw {product.price}</Typography>
            </Link>
          </Box>
        <Box sx={{ mt: 3 }}>
          <ShoppingCartIcon sx={{margin: 1, cursor: 'pointer'}} onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}/>
        </Box>
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

export default CarouselCard;

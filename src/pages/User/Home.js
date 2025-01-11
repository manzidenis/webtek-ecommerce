import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from 'components/Header';
import Container from '@mui/material/Container';
import Products from 'components/Products';
import '../../App.css';
import Footer from 'components/Footer';
import { displayOnDesktop } from 'themes/commonStyles';
import MobileFooter from 'components/MobileFooter';
import { fetchProducts } from '../../redux/userSlice/productSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../../redux/userSlice/cartSlice';

function Home() {

    const dispatch = useDispatch();
    const { products, searchTerm } = useSelector(state => state.userProducts);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCart());
    }, [dispatch]);
        
      const filteredProducts = products.filter(product => product.available === true).filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(products);
    
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: 100,
              overflowY: 'scroll',
              marginTop:5
            }}
          >
            <Container maxWidth="xl" sx={{ mb: 3 }}>
              <Products products={filteredProducts} />
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                }}
              >
                <MobileFooter />
              </Box>
            </Container>
          </Box>
          <Box sx={displayOnDesktop}>
            <Footer />
          </Box>
        </Box>
      </React.Fragment>
    );
  }
  
  export default Home;
  
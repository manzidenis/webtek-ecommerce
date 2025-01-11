import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Product from './Product';

const Products = ({products}) => {
  return (
    <Box sx={{ mx: 2 }}>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {products.map((product) => {
          return (
            <Grid key={product.id} item xs={12} sm={4} md={4} lg={3}>
              <Product product={product} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Products;

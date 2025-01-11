// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
  cart: {
    id: null,
    items: []
  },
  loading: false,
  error: null
};

// Async thunk to fetch cart data
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/user/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to add item to cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ cartId, product, quantity }, { rejectWithValue }) => {
      try {
        
        const token = localStorage.getItem('token');
        const response = await axiosInstance.post(`/user/cart/${cartId}/product`, {
            productId: product.id,
          quantity: quantity,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const updateCartQuantity = createAsyncThunk(
    'cart/updateCartQuantity',
    async ({ cartId, item, quantity }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.put(`/user/cart/${cartId}/product/${item.id}`, {
          quantity,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Async thunk to remove item from cart
  export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async ({ cartId, item }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        console.log(cartId);
        console.log(item);
        await axiosInstance.delete(`/user/cart/${cartId}/product/${item.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return item.id;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart.items = action.payload.items;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cart.items = action.payload.items;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
      });
  }
});

export default cartSlice.reducer;

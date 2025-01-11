// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
  products: [],
  searchTerm: '',
  loading: false,
  error: null,
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/user/products', {
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

  export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(`/user/products/${id}`,{
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
  

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm } = productSlice.actions;
export default productSlice.reducer;

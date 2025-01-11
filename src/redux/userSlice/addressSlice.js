// src/redux/userSlice/addressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance'; // Adjust the path to your axios instance

// Initial state
const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/account/address',{
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

export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (address, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/account/address', address,{
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

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ id, address }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axiosInstance.put(`/account/address/${id}`, address,{
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

export const removeAddress = createAsyncThunk(
  'addresses/removeAddress',
  async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      await axiosInstance.delete(`/account/address/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(address => address.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(address => address.id !== action.payload);
      });
  },
});

export default addressSlice.reducer;

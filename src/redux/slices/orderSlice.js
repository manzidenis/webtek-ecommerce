import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/admin/orders', {
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

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        console.log(status);
        const response = await axiosInstance.put(`/admin/orders/${id}/status`, status, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return { id, status: response.data.status };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index].status = action.payload.status;
        }
      });
  },
});

export const selectOrders = (state) => state.orders.orders;
export const selectLoading = (state) => state.orders.loading;
export const selectError = (state) => state.orders.error;

export default orderSlice.reducer;

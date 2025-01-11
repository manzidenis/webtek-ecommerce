import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

// Asynchronous thunk action to fetch categories
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/admin/product-categories', {
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

// Asynchronous thunk action to add a category
export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (category, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/admin/product-categories', category, {
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

// Asynchronous thunk action to delete a category
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/admin/product-categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Asynchronous thunk action to update a category
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(`/admin/product-categories/${id}`, category, {
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

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectCategories = (state) => state.category.categories;
export const selectLoading = (state) => state.category.loading;
export const selectError = (state) => state.category.error;

export default categorySlice.reducer;

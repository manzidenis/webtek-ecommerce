import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import userProductReducer from './userSlice/productSlice';
import cartReducer from './userSlice/cartSlice';
import addressReducer from './userSlice/addressSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    products: productReducer,
    userProducts: userProductReducer,
    orders: orderReducer,
    cart: cartReducer,
    addresses: addressReducer,
  },
});

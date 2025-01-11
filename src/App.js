import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import ProtectedAdminRoute from "./utils/ProtectedAdminRoute";
import ProtectedUserRoute from "./utils/ProtectedUserRoute";
import UserHome from './pages/User/Home';
import ProductDetails from 'pages/User/productDetails';
import Address from 'pages/User/Adress';
import ProfilePage from 'pages/User/ProfilePage';
import OrderPage from 'pages/User/order';
import Checkout from 'pages/User/Checkout/Checkout';
import Logout from 'pages/Auth/Logout';
// import CategoryPage from 'pages/Admin/Category';
import CategoryPage from 'pages/admin/Category';
import ProductPage from 'pages/admin/Product';
import ProductDetailsAdmin from 'pages/admin/ProductDetails';
import OrderPageAdmin from 'pages/admin/order';
import ProfilePageAdmin from 'pages/admin/ProfilePage';
import AccessDenied from 'pages/error/AccessDenied';
import NotFound from 'pages/error/NotFound';
import ServerError from 'pages/error/ServerError';
import StatisticsPage from 'pages/admin/StatisticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/logout" element={<Logout />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/"
          element={
            <ProtectedUserRoute>
              <UserHome />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedUserRoute>
              <OrderPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedUserRoute>
              <Checkout />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedUserRoute>
              <Address />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedUserRoute>
              <ProfilePage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedUserRoute>
              <ProductDetails />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedUserRoute>
              <LoginPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <StatisticsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/dashboard/categories"
          element={
            <ProtectedAdminRoute>
              <CategoryPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <ProtectedAdminRoute>
              <ProductPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/dashboard/product/:id"
          element={
            <ProtectedAdminRoute>
              <ProductDetailsAdmin />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedAdminRoute>
              <OrderPageAdmin />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedAdminRoute>
              <ProfilePageAdmin />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/500" element={<ServerError />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticated, isUser } from './authUser';
import { setUser, selectUser } from '../redux/slices/userSlice';
import axiosInstance from '../utils/axiosInstance';

const ProtectedUserRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isRoleUser, setIsRoleUser] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const roleIsUser = await isUser();
        setIsRoleUser(roleIsUser);
      }
      setIsAuth(isAuthenticated());
      setLoading(false);
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (!user.userId && isAuthenticated()) {
      fetchUserData();
    }

    checkAuth();
  }, [dispatch, user.userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (!isRoleUser) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default ProtectedUserRoute;

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    dispatch(clearUser());
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;

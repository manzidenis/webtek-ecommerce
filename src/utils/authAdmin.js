import axiosInstance from './axiosInstance';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const isAdmin = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axiosInstance.get('/account',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.role === 'ADMIN';
  } catch (error) {
    console.error('Error checking token', error);
    return false;
  }
};

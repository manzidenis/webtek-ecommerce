import axiosInstance from './axiosInstance';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const isUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axiosInstance.get('/account',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.role === 'USER';
  } catch (error) {
    console.error('Error checking token', error);
    return false;
  }
};

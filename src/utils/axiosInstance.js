import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_APP_API}/api/v1`,
});

export default axiosInstance;

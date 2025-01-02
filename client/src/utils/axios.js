import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/', // Set your API base URL here
  withCredentials: true, // To send cookies with requests
});

// Request interceptor to add the Authorization header
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Handle both 401 and 403 status codes for token refresh
    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await instance.post('http://localhost:3000/api/v1/auth/token', {}, { withCredentials: true }); // Use instance to maintain baseURL
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`; // Update instance defaults
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest); // Use instance for retry request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
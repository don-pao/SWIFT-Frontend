import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/user';

// Create an Axios instance for API requests
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the Authorization header with the token to all requests through the `api` instance
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', {
        username: credentials.username,
        password: credentials.password,
      });
      
      const data = response.data;

      // Store the token and any other data returned by the login response
      if (data.token) {
        localStorage.setItem('token', data.token);
        
        // Optional: Store token expiration if returned by the backend
        if (data.tokenExpiry) {
          localStorage.setItem('tokenExpiry', data.tokenExpiry);
        }
      }
      
      // Store user data as before
      if (data.userId) {
        localStorage.setItem('userData', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  logout: () => {
    // Clear the token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry'); // Optional, if tokenExpiry is stored
    localStorage.removeItem('userData');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !tokenExpiry) return false;

    const now = Date.now();
    return now < parseInt(tokenExpiry, 10); // Check if token is still valid
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  updateUserDetails: async (userID, updatedDetails) => {
    try {
      const response = await api.put(`/put?userID=${userID}`, updatedDetails);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Update failed');
    }
  },

  usernameExists: async (username) => {
    const response = await api.get(`/exists?username=${username}`);
    return response.data.exists;
  },

  emailExists: async (email) => {
    try {
      const response = await api.get(`/exists/email?email=${encodeURIComponent(email)}`);
      return response.data.exists;
    } catch (error) {
      console.error('Email existence check failed:', error.response?.data?.error || 'Error');
      return false;
    }
  },

  verifyPassword: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      return response.status === 200;
    } catch (error) {
      console.error('Password verification failed:', error.response?.data?.error || 'Error');
      return false;
    }
  },

  deleteUser: async (userID) => {
    try {
      const response = await api.delete(`/delete/${userID}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Deletion failed');
    }
  },
};

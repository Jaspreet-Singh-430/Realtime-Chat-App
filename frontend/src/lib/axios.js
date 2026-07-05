import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_MODE=="development"?"http://localhost:5001/api":"/api", // Replace with your backend API URL
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
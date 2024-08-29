import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',  // Your Flask API base URL
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': localStorage.getItem('csrfToken') || ''  // Set CSRF token if needed
  }
});

export default AxiosInstance;

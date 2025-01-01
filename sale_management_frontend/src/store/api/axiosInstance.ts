import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

// Request interceptor for adding token to headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      // No response received from server
      console.error("No response received:", error.request);
    } else {
      // Error setting up the request
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

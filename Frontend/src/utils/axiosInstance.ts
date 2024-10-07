import store from "../store/store"; // Import your store
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    timeout: 1000,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Access the state directly
    const User = state.user;
    if (User?.token) {
      config.headers.Authorization = `Bearer ${User.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

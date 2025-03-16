import store from "../store/store"; // Import your store
import axios from "axios";
import showToast from "./showToast";
import { logout } from "../store/userSlice";

const axiosInstance = axios.create({
  baseURL: "https://planet-9sgy.onrender.com/api",
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

const dispatch = store.dispatch;
const redirectToLogin = () => {
  window.location.href = "/login";
  dispatch(logout());
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    showToast(error.response.data);
    if (error.response && error.response?.status === 401) {
      redirectToLogin();
    }
    // Return a resolved promise to prevent error propagation
    return Promise.resolve(error);
  }
);

export default axiosInstance;

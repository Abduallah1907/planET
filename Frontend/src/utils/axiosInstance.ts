import store from "../store/store"; // Import your store
import axios from "axios";
import showToast from "./showToast";
import { ToastTypes } from "./toastTypes";
import { logout } from "../store/userSlice";

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

const dispatch = store.dispatch;
const redirectToLogin = () => {
  window.location.href = "/login";
  dispatch(logout());
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    showToast(error.message, ToastTypes.ERROR);
    if(error.response && error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

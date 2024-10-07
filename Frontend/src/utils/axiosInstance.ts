import { useAppSelector } from "../store/hooks";
import axios from "axios"; 

const axiosInstance = axios.create({
  baseURL : 'http://localhost:8000/api',
  headers: {
//  Authorization: <Your Auth Token>,
    "Content-Type": "application/json",
    timeout : 1000,
  }, 
  // .. other options
});
axios.interceptors.request.use(request => {
  const User = useAppSelector((state) => state.user);
  const isLoggedIn = User?.token;


  if (isLoggedIn ) {
      request.headers.common.Authorization = `Bearer ${User.token}`;
  }

  return request;
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Do something before request is sent
//     const token = window.localStorage.getItem('token') //do not store token on localstorage!!!
//     config.headers.Authorization = token
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
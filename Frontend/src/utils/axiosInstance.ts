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

export default axiosInstance;
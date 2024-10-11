import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class AdminService {

  // Function to delete user account
  public static deleteUser = async (email: any) => {
    try {
      const response = await axiosInstance.delete(`/admin/deleteUser/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static getUsers = async (page: number) => {
    try {
      const response = await axiosInstance.get(`/admin/getUsers/${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static createAdmin = async (data:any) => {
    try {
      const response = await axiosInstance.post(`/admin/createAdmin/`,data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static createGovernor = async (data:any) => {
    try {
      const response = await axiosInstance.post(`/admin/createGovernor/`,data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
}

export { AdminService };
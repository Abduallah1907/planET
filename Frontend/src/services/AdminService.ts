import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class AdminService {

  // Function to delete user account
  public static deleteAccount = async (userId: any, authToken: any) => {
    try {
      const response = await axiosInstance.delete(`/admin/deleteUser/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static CreateAdmin = async (data:any) => {
    try {
      const response = await axiosInstance.post(`/admin/createAdmin/`,data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static CreateGoverner = async (data:any) => {
    try {
      const response = await axiosInstance.post(`/admin/createGoverner/`,data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
}

export { AdminService };
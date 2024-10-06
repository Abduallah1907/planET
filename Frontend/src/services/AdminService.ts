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
}

export { AdminService };
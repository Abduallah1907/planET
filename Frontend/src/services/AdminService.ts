import axiosInstance from '../utils/axiosInstance';

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
  public static getTags = async (page: number) => {
    try {
    const response = await axiosInstance.get(`/admin/getTags/${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
}

export { AdminService };
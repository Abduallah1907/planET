import axiosInstance from '../utils/axiosInstance';

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
  public static getTags = async (page: number) => {
    try {
    const response = await axiosInstance.get(`/admin/getTags/${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static changePass = async (email: string, AdminData: object) => {
    try {
      const response = await axiosInstance.put(`/admin/updateAdmin/${email}`, AdminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
}

export { AdminService };
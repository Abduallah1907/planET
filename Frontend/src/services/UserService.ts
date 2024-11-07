import axiosInstance from "../utils/axiosInstance";
import showToast from "../utils/showToast";

class UserService {
  public static getDocuments = async (user_id: string, role: string) => {
    try {
      const response = await axiosInstance.get(`/users/getDocumentsRequired`, {
        params: { user_id, role },
      });
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static acceptUser = async (email: string) => {
    try {
      const response = await axiosInstance.put(`/admin/acceptUser/${email}`);
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static rejectUser = async (email: string) => {
    try {
      const response = await axiosInstance.put(`/admin/rejectUser/${email}`);
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default UserService;

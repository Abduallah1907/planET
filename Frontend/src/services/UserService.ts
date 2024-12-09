import showToastMessage from "../utils/showToastMessage";
import axiosInstance from "../utils/axiosInstance";
import showToast from "../utils/showToast";
import { ToastTypes } from "../utils/toastTypes";

class UserService {
  public static getDocuments = async (user_id: string, role: string) => {
    try {
      const response = await axiosInstance.get(`/users/getDocumentsRequired`, {
        params: { user_id, role },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static acceptUser = async (email: string) => {
    try {
      const response = await axiosInstance.put(`/admin/acceptUser/${email}`);
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static rejectUser = async (email: string) => {
    try {
      const response = await axiosInstance.put(`/admin/rejectUser/${email}`);
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static sendNotificationAndEmailForUpcomingEvents = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/SendNotificationAndEmailforUpcomingEvents`
      );
      if (response.status === 200) showToastMessage("Notification sent",ToastTypes.SUCCESS);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static sendNotificationAndEmailForBirthday = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/SendNotificationAndEmailforBirthday`
      );
      if (response.status === 200) showToastMessage("Notification sent",ToastTypes.SUCCESS);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default UserService;

import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class NotificationService{
    public static getNotificationsByEmail = async (email : string) => {
        try {
            const response = await axiosInstance.get(`/notification/getNotificationsByEmail/${email}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    public static getNotificationNumber = async (email : string) => {
        try {
            const response = await axiosInstance.get(`/notification/getNotificationNumber/${email}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };
}

export default NotificationService;
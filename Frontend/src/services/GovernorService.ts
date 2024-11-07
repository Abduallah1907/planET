import axiosInstance from "../utils/axiosInstance";
import showToast from "../utils/showToast";

class GovernorService {
  // Function to delete user account

  public static changePass = async (email: string, Gdata: object) => {
    try {
      const response = await axiosInstance.put(
        `/users/updateGovernor/${email}`,
        Gdata
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { GovernorService };

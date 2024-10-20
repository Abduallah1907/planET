import axiosInstance from '../utils/axiosInstance';

class GovernorService {

  // Function to delete user account
 
  public static changePass = async (email: string, Gdata: object) => {
    try {
      const response = await axiosInstance.put(`/users/updateGovernor/${email}`, Gdata);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
}

export { GovernorService };
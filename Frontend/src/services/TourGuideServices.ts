import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import showToast from "../../src/utils/showToast";

class TourGuideServices {
  public static getTourGuideByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(
        `/tourGuide/getProfile/${email}`
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateTourGuide = async (
    email: string,
    TourGuideData: object
  ) => {
    try {
      const response = await axiosInstance.put(
        `/tourGuide/updateProfile/${email}`,
        TourGuideData
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static deleteTourGuide = async (email: string) => {
    try {
      const response = await axiosInstance.delete(
        `/tourGuide/deleteTourGuideAccountRequest/${email}`
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { TourGuideServices };

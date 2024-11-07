import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import showToast from "../../src/utils/showToast";
class AdvertiserService {
  public static getAdvertiserByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(
        `/advertiser/getAdvertiserByEmail/${email}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateAdvertiser = async (
    email: string,
    touristData: object
  ) => {
    try {
      const response = await axiosInstance.put(
        `/advertiser/updateAdvertiser/${email}`,
        touristData
      );
      if (response.status === 200) {
        showToast(response.data);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static deleteAdvertiser = async (email: string) => {
    try {
      const response = await axiosInstance.delete(
        `/advertiser/deleteAdvertiserAccountRequest/${email}`
      );
      if (response.status === 200) {
        showToast(response.data);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { AdvertiserService };

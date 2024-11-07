import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import showToast from "../../src/utils/showToast";
import response from "../response";

class AdvertiserService {
  public static getAdvertiserByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(
        `/advertiser/getAdvertiserByEmail/${email}`
      );
      showToast(response.data);
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
      showToast(response.data);

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
      if (response) showToast(response.data);

      return response.data;
    } catch (error: any) {
      const response = {
        success: false,
        data: null,
        message: error.message,
        status: error.status,
      };
      showToast(response);
    }
  };
}

export { AdvertiserService };

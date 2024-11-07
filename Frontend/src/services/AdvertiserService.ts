import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

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

        // Check if the response status indicates success
        if (response.status !== 200 && response.status !== 204) {
            throw response; // Rethrow the response directly without a custom error message
        }

        return response.data;
    } catch (error) {
        // Rethrow the error to let the calling code handle it
        throw error;
    }
}

}

export { AdvertiserService };

import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import showToast from "../../src/utils/showToast";

class SellerServices {
  public static getSellerServicesByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/seller/getSeller/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateSellerServices = async (
    email: string,
    SellerData: object
  ) => {
    try {
      const response = await axiosInstance.put(
        `/seller/updateSeller/${email}`,
        SellerData
      );
      if (response.status === 200) {
        showToast(response.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static deleteSellerServices = async (email: string) => {
    try {
        const response = await axiosInstance.delete(
            `/seller/deleteSellerAccountRequest/${email}`
        );

        // Check if the response status indicates success
        if (response.status !== 200 && response.status !== 204) {
            throw response; // Rethrow the response directly for centralized error handling
        }

        return response.data;
    } catch (error) {
        // Rethrow the error to let the calling function handle it with the toast
        throw error;
    }
}


  
}

export { SellerServices };

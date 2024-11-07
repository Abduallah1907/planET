import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import showToast from "../../src/utils/showToast";

class SellerServices {
  public static getSellerServicesByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/seller/getSeller/${email}`);
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { SellerServices };

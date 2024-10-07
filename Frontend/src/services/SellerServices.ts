import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class SellerServices {

  

  
  public static getSellerServicesByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(`seller/getSeller/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateSellerServices = async (email: string, SellerData: object) => {
    try {
      const response = await axiosInstance.put(`seller/updateSeller/${email}`, SellerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  
}

export { SellerServices };

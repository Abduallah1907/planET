import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class AdvertiserService {

  

  
  public static getAdvertiserByemail = async (email: string) => {
    try {
      
      const response = await axiosInstance.get(`/advertiser/getAdvertiserByEmail/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateAdvertiser = async (email: string, touristData: object) => {
    try {
      
      const response = await axiosInstance.put(`/advertiser/updateAdvertiser/${email}`,touristData,{headers:{'Content-Type':'multipart/form-data'}});
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  
}

export { AdvertiserService };

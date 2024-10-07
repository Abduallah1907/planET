import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class TourGuideServices {

  

  
  public static getTourGuideByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(`tourGuide/getProfile/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateTourGuide = async (email: string, TourGuideData: object) => {
    try {
      const response = await axiosInstance.put(`tourGuide/updateProfile/${email}`, TourGuideData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  
}

export { TourGuideServices };

import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class TourGuideServices {

  

  
  public static getTourGuideByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourGuide/getProfile/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateTourGuide = async (email: string, TourGuideData: object) => {
    try {
      const response = await axiosInstance.put(`/tourGuide/updateProfile/${email}`, TourGuideData);
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

export { TourGuideServices };

import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class TouristService {
 
  

  
  public static getTouristByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getTourist/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateTourist = async (email: string, advertiserData: object) => {
    try {
      const response = await axiosInstance.put(`/tourist/updateTourist/${email}`, advertiserData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  public static rateAndCommentActivity = async (id: string, data:any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateandcommentActivity/${id}`,data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static rateAndCommentItinerary = async (id: string, data:any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateandcommentItinerary/${id}`,data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  public static rateAndCommentTourGuide = async (id: string, data:any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateandcommentTourGuide/${id}`,data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static redeemPoints = async (email: string, points: number) => {
    try {
      const response = await axiosInstance.put(`/tourist/redeemPoints/`, {email,points});
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  
  public static fileComplaint = async (id: string, data:any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/fileComplaint/${id}`,data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
 public static getWalletBalance() {
    try {
      return axiosInstance.get('/tourist/getWalletBalance');
    } catch (error) {
      throw error;
    }
}
public 

}

export { TouristService };

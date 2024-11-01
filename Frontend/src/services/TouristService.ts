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
        `/tourist/rateAndCommentActivity/${id}`,data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static rateAndCommentItinerary = async (id: string, data:any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateAndCommentItinerary/${id}`,data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  public static rateAndCommentTourGuide = async (id: string, data:any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateAndCommentTourGuide/${id}`,data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static redeemPoints = async (email: string, points: number) => {
    try {
      const response = await axiosInstance.put(`/tourist/redeemPoints/${email}`, {points});
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
  
  public static checkActivity = async (id: string, activity_id: string) => {
    try {
      const response = await axiosInstance.get(
        `/tourist/checkActivity/${id}`,{params:{activity_id}}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static checkItinerary = async (id: string, itinerary_id: string) => {
    try {
      const response = await axiosInstance.get(
        `/tourist/checkItinerary/${id}`,{params:{itinerary_id}}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static checkTourGuide = async (id: string, tour_guide_email: string) => {
    try {
      const response = await axiosInstance.get(
        `/tourist/checkTourGuide/${id}`,{params:{tour_guide_email}}
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static deleteTourist = async (email: string) => {
    try {
      const response = await axiosInstance.delete(`/tourist/deleteTouristAccountRequest/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export { TouristService };

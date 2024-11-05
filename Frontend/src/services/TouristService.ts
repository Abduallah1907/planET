import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

class TouristService {
  public static getTouristByemail = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getTourist/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateTourist = async (
    email: string,
    advertiserData: object
  ) => {
    try {
      const response = await axiosInstance.put(
        `/tourist/updateTourist/${email}`,
        advertiserData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static rateAndCommentActivity = async (id: string, data: any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateAndCommentActivity/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static rateAndCommentItinerary = async (id: string, data: any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateAndCommentItinerary/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static rateAndCommentTourGuide = async (id: string, data: any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/rateAndCommentTourGuide/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static redeemPoints = async (email: string, points: number) => {
    try {
      const response = await axiosInstance.put(`/tourist/redeemPoints/`, { email, points });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static fileComplaint = async (id: string, data: any) => {
    try {
      const response = await axiosInstance.post(
        `/tourist/fileComplaint/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static checkActivity = async (id: string, activity_id: string) => {
    try {
      const response = await axiosInstance.get(
        `/tourist/checkActivity/${id}`, { params: { activity_id } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static checkItinerary = async (id: string, itinerary_id: string) => {
    try {
      const response = await axiosInstance.get(
        `/tourist/checkItinerary/${id}`, { params: { itinerary_id } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static checkTourGuide = async (
    id: string,
    tour_guide_email: string
  ) => {
    try {
      const response = await axiosInstance.get(
        `/tourist/checkTourGuide/${id}`, { params: { tour_guide_email } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static viewMyComplaints = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/viewComplaints/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static bookActivity = async (email: string, activity_id: string) => {
    try {
      const response = await axiosInstance.post(`/tourist/bookActivity`, { email, activity_id });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static bookItinerary = async (email: string, itinerary_id: string, time_to_attend: string) => {
    try {
      const response = await axiosInstance.post(`/tourist/bookItinerary`, { email, itinerary_id, time_to_attend });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  public static deleteTourist = async (email: string) => {
    try {
      const response = await axiosInstance.delete(`/tourist/deleteTouristAccountRequest/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static getUpcomingActivityBookings = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getUpcomingActivityBookings/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static getPastActivityBookings = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getPastActivityBookings/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static getUpcomingItineraryBookings = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getUpcomingItineraryBookings/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static getPastItineraryBookings = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getPastItineraryBookings/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static cancelTicket = async (tourist_id: string, ticket_id: string) => {
    try {
      const response = await axiosInstance.put(`/tourist/cancelTicket/${tourist_id}?ticket_id=${ticket_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static getMyTourGuides = async (tourist_id: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getMyTourGuides/${tourist_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public static createOrder = async (orderData: any) => {
    try {
      const response = await axiosInstance.post(`/tourist/createOrder/`, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static getPastOrders = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/tourist/getPastOrders/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public static rateAndCommentProduct = async (tourist_id: string,product_id: string, comment: string, rating: number) => {
    try {
      const response = await axiosInstance.post(`/tourist/rateAndCommentProduct/${tourist_id}`, {product_id, comment, rating });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export { TouristService };

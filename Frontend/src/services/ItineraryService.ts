import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class ItineraryService {
  public static getAllItineraries = async (page: number) => {
    try {
      const response = await axiosInstance.get(
        `/itinerary/getAllItineraries/${page}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getItinerariesByTourGuideId = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/itinerary/getAllItinerariesByTourGuideID/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getItineraryById = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/itinerary/getItineraryByID/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static getFilterComponents = async () => {
    try {
      const response = await axiosInstance.get(
        "/itinerary/getFilterComponents"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static updateItinerary = async (id: string, itineraryBody: any) => {
    try {
      const response = await axiosInstance.put(
        `/itinerary/updateItinerary/${id}`,
        itineraryBody
      );
      console.log(response);
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getSearchItinerary = async () => {
    try {
      const response = await axiosInstance.get("/itinerary/getSearchItinerary");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getUpcomingItineraries = async () => {
    try {
      const response = await axiosInstance.get(
        "/itinerary/getUpcomingItineraries"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getFilteredItineraries = async (filter: any) => {
    try {
      const response = await axiosInstance.get(
        "/itinerary/getFilteredItineraries",
        { params: filter }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getSortedItineraries = async () => {
    try {
      const response = await axiosInstance.get(
        "/itinerary/getSortedItineraries"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static createItinerary = async (itineraryBody: any) => {
    try {
      const response = await axiosInstance.post(
        "/itinerary/createItinerary",
        itineraryBody
      );
      if (response.status === 201) showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static deleteItinerary = async (id: string) => {
    try {
      const response = await axiosInstance.delete(
        `/itinerary/deleteItinerary/${id}`
      );
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static flagInappropriate = async (id: string) => {
    try {
      const response = await axiosInstance.put(
        `/itinerary/flagItinerary/${id}`
      );
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static getComments = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/itinerary/getComments/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { ItineraryService };

import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class ItineraryService {
  public static getAllItineraries = async (page: number) => {
    try {
      const response = await axiosInstance.get(
        `/itinerary/getAllItineraries/${page}`
      );
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getSearchItinerary = async () => {
    try {
      const response = await axiosInstance.get("/itinerary/getSearchItinerary");
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
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
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { ItineraryService };

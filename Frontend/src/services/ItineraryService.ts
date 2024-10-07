import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class ItineraryService{
 public static getAllItineraries=async (page:number) => {
    try{
      const response=await axiosInstance.get(`/itinerary/getAllItineraries/${page}`)
      return response.data;
    }
    catch(error){
     throw error;
    }
      
 };
 public static getItineraryById=async (id:string) => {
  try{
    const response=await axiosInstance.get(`/itinerary/getItineraryByID/${id}`);
    return response.data;
  }
  catch(error){
  throw error;
  }
    
};
 public static getFilterComponents=async () => {
  try{
    const response=await axiosInstance.get("/itinerary/getFilterComponents")
    return response.data;
  }
  catch(error){
   throw error;
  }
    
};
  public static editItinerary = async (id: string) => {
    try {
      const response = await axiosInstance.put(`/itinerary/editItinerary/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

public static getSearchItinerary=async () => {
  try{
    const response=await axiosInstance.get("/itinerary/getSearchItinerary")
    return response.data;
  }
  catch(error){
   throw error;
  }
    
};

public static getUpcomingItineraries=async () => {
  try{
    const response=await axiosInstance.get("/itinerary/getUpcomingItineraries")
    return response.data;
  }
  catch(error){
   throw error;
  }
    
};

public static getFilteredItineraries=async () => {
  try{
    const response=await axiosInstance.get("/itinerary/getFilteredItineraries")
    return response.data;
  }
  catch(error){
   throw error;
  }
    
};

public static getSortedItineraries=async () => {
  try{
    const response=await axiosInstance.get("/itinerary/getSortedItineraries")
    return response.data;
  }
  catch(error){
   throw error;
  }
    
};
}
export{ItineraryService};
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class ItineraryService{
 public static getAllItineraries=async () => {
    try{
      const response=await axiosInstance.get("/itinerary/getAllItineraries")
      return response.data;
    }
    catch(error){
     throw error;
    }
      
 };
}
export{ItineraryService};
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
}
export{ItineraryService};
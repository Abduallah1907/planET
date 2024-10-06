import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class HistoricalService{
 public static getAllHistorical_Location=async () => {
    try{
      const response=await axiosInstance.get("/historical_location/getAllHistorical_Location")
      return response.data;
    }
    catch(error){
     throw error;
    }
      
 };
}
export{HistoricalService};
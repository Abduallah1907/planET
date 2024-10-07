import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class HistoricalService{
  public static getHistoricalLocationById=async (id:string) => {
    try{
      const response=await axiosInstance.get(`/historical_location/getHistorical_locationByID/${id}`);
      return response.data;
    }
    catch(error){
     throw error;
    }
      
  };
 public static getAllHistorical_Location=async (nation:string , job:string) => {
    try{

      const response=await axiosInstance.get("/historical_location/getAllHistorical_locations",{params:{nation ,job}})
      return response.data;
    }
    catch(error){
     throw error;
    }
      
 };
}
export{HistoricalService};
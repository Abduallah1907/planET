import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class ActivityService{
 public static getAllActivties=async () => {
    try{
      const response=await axiosInstance.get("/activity/getAllActivties");
      return response.data;
    }
    catch(error){
     throw error;
    }
      
 };
}
export{ActivityService};

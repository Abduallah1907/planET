import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

class ProductService{
 public static getAllProducts=async () => {
    try{
      const response=await axiosInstance.get("/product/getAllProducts");
      return response.data;
    }
    catch(error){
     throw error;
    }
      
 };
  public static getProductByName=async (name:string) => {
      try{
        const response=await axiosInstance.get(`/product/getProductByName/${name}`);
        return response.data;
      }
      catch(error){
      throw error;
      }
        
  };

  public static getFilteredProducts = async (filter: any) => {
    try{
      const response = await axiosInstance.get("/product/getFilteredProducts", {params: filter})
      return response.data;
    }catch (error){
      throw error;
    }
  }
  public static getFilterComponents=async () => {
    try{
      const response=await axiosInstance.get("/product/getFilterComponents/");
      return response.data;
    }
    catch(error){
    throw error;
    }
      
};
}
export{ProductService};

import axiosInstance from "../utils/axiosInstance";

class SalesService {
  public static getAllSales = async (start_date: string, end_date: string) => {
    try {
      // Include query parameters in the URL
      const response = await axiosInstance.get("/admin/getSalesReport", {
        params: { start_date, end_date },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `HTTP error! status: ${error.response.status} - ${error.response.statusText}`
        );
      }
      // Handle other errors (e.g., network issues)
      throw new Error(`Network error: ${error.message}`);
    }
  };
  public static getSalesTG = async (email:string,start_date: string, end_date: string) => {
    try {
      // Include query parameters in the URL
      const response = await axiosInstance.get(`/tourGuide/getSalesReport/${email}`, {
        params: { start_date, end_date },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `HTTP error! status: ${error.response.status} - ${error.response.statusText}`
        );
      }
      // Handle other errors (e.g., network issues)
      throw new Error(`Network error: ${error.message}`);
    }
  };
  public static getSalesAdv = async (email:string,start_date: string, end_date: string) => {
    try {
      // Include query parameters in the URL
   
      const response = await axiosInstance.get(`/advertiser/getSalesReport/${email}`, {
        params: { start_date, end_date },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `HTTP error! status: ${error.response.status} - ${error.response.statusText}`
        );
      }
      // Handle other errors (e.g., network issues)
      throw new Error(`Network error: ${error.message}`);
    }
  };
  public static getSalesS = async (email:string,start_date: string, end_date: string) => {
    try {
      // Include query parameters in the URL
   
      const response = await axiosInstance.get(`/seller/getSalesReport/${email}`, {
        params: { start_date, end_date },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `HTTP error! status: ${error.response.status} - ${error.response.statusText}`
        );
      }
      // Handle other errors (e.g., network issues)
      throw new Error(`Network error: ${error.message}`);
    }
  };
}

export default SalesService;

import axiosInstance from "../utils/axiosInstance";
import axios from "axios";


class HistoricalService {
  public static getHistoricalLocationById = async (historical_location_id: string) => {
    try {
      const response = await axiosInstance.get('/historical_location/getHistorical_locationByID', {
        params: { historical_location_id: historical_location_id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getHistoricalLocationByIdForGoverner = async (historical_location_id: string) => {
    try {
      const response = await axiosInstance.get('/historical_location/getHistorical_locationByIDForGoverner', {
        params: { historical_location_id: historical_location_id }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getAllHistorical_Location = async (nation: string, job: string) => {
    try {

      const response = await axiosInstance.get("/historical_location/getAllHistorical_locations", { params: { nation, job } })
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getFilteredHistorical_Location = async (filter: any) => {
    try{
      const response = await axiosInstance.get("/historical_location/getFilteredHistorical_locations", {params: filter})
      return response.data;
    }catch (error){
      throw error;
    }
  }

  public static async addHistoricalLocation(formData: any) {
    try {
      const response = await axiosInstance.post(
        "/historical_location/createHistorical_location",
        formData);
          return response.data;
    } catch (err) {
      throw err;
    }
  }

  public static getFilterComponents = async () => {
    try {
      const response = await axiosInstance.get("/historical_location/getFilterComponents");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("API Error: ", error.response.data);
        throw new Error(
          error.response.data.message || "Historical Location failed"
        );
      } else {
        throw new Error("Historical Location failed");
      }
    }
  }

  public static async editHistoricalLocation(id: string, formData: any) {
    try {
      const response = await axiosInstance.put(
        `/historical_location/updateHistorical_location/${id}`, // Use PUT for updates and include the location ID
        formData
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("API Error: ", error.response.data);
        throw new Error(
          error.response.data.message || "Editing Historical Location failed"
        );
      } else {
        throw new Error("Editing Historical Location failed");
      }
    }
  }

  public static async deleteHistoricalLocation(id: string) {
    try {
      const response = await axiosInstance.delete(
        `/historical_location/deleteHistorical_location/${id}`, // Use PUT for updates and include the location ID
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("API Error: ", error.response.data);
        throw new Error(
          error.response.data.message || "Deleting Historical Location failed"
        );
      } else {
        throw new Error("Deleting Historical Location failed");
      }
    }
  }

  public static async getAllHistorical_Tags(){
    try{
      const response = await axiosInstance.get("/historical_tag/getAllHistorical_tag");
      return response.data;
    }catch(error){
      throw error;
    }
  }
}
export { HistoricalService };
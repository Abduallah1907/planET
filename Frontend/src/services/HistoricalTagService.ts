import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class HistoricalTagService {
  public static async getAll() {
    try {
      const response = await axiosInstance.get(
        "/historical_tag/getAllHistorical_tag"
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching tags");
    }
  }

  public static async create(tag: any) {
    try {
      const response = await axiosInstance.post(
        "/historical_tag/createHistorical_tag",
        tag
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error creating tags");
    }
  }

  public static async update(id: string, tag: any) {
    try {
      const response = await axiosInstance.put(
        `/historical_tag/updateHistorical_tag/${id}`,
        tag
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error updating tags");
    }
  }

  public static async delete(id: string) {
    try {
      const response = await axiosInstance.delete(
        "/historical_tag/deleteHistorical_tag/" + id
      );
      showToast(response.data);
    } catch (error) {
      throw new Error("Error deleting tags");
    }
  }
}

export default HistoricalTagService;

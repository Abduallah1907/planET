import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class ActivityService {
  public static getAllActivities = async () => {
    try {
      const response = await axiosInstance.get("/activity/getAllActivities");
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static getActivityById = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/activity/getActivityByID/${id}`
      );
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getActivitiesByAdvertiserId = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/activity/getActivitiesByAdvertiserID/${id}`
      );
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getFilteredActivites = async (filter: any) => {
    try {
      const response = await axiosInstance.get(
        "/activity/getFilteredActivities",
        { params: filter }
      );
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getFilterComponents = async () => {
    try {
      const response = await axiosInstance.get(
        "/activity/getFilterComponents/"
      );
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static createActivity = async (productData: any) => {
    try {
      const response = await axiosInstance.post(
        `/activity/addActivity`,
        productData
      );
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static updateActivity = async (
    activityId: string,
    updatedData: any
  ) => {
    try {
      const response = await axiosInstance.put(
        `/activity/updateActivity/${activityId}`,
        updatedData
      );
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static deleteActivity = async (activityId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/activity/deleteActivity/${activityId}`
      );
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static flagInappropriate = async (id: string) => {
    try {
      const response = await axiosInstance.put(`/activity/flagActivity/${id}`);
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { ActivityService };

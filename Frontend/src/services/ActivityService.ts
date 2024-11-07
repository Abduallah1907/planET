import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class ActivityService {
  public static getAllActivities = async () => {
    try {
      const response = await axiosInstance.get("/activity/getAllActivities");
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
      if (response.status === 201) showToast(response.data);

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
      if (response.status === 200) showToast(response.data);

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
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static flagInappropriate = async (id: string) => {
    try {
      const response = await axiosInstance.put(`/activity/flagActivity/${id}`);
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export { ActivityService };

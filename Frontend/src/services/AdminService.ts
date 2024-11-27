import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class AdminService {
  // Function to delete user account
  public static deleteUser = async (email: any) => {
    try {
      const response = await axiosInstance.delete(`/admin/deleteUser/${email}`);
      if (response.status === 200) {
        showToast(response.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static getUsers = async (page: number) => {
    try {
      const response = await axiosInstance.get(`/admin/getUsers/${page}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static createAdmin = async (data: any) => {
    try {
      const response = await axiosInstance.post(`/admin/createAdmin/`, data);

      if (response.status === 201) showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static createGovernor = async (data: any) => {
    try {
      const response = await axiosInstance.post(`/admin/createGovernor/`, data);
      if (response.status === 201) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static getTags = async (page: number) => {
    try {
      const response = await axiosInstance.get(`/admin/getTags/${page}`);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static changePass = async (email: string, AdminData: object) => {
    try {
      const response = await axiosInstance.put(
        `/admin/updateAdmin/${email}`,
        AdminData
      );
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getComplaints = async () => {
    try {
      const response = await axiosInstance.get(`/admin/getComplaints`);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static markResolved = async (id: string) => {
    try {
      const response = await axiosInstance.put(
        `/admin/markComplaintResolved/${id}`
      );
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static markPending = async (id: string) => {
    try {
      const response = await axiosInstance.put(
        `/admin/markComplaintPending/${id}`
      );
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static replyComplaint = async (id: string, reply: string) => {
    try {
      const response = await axiosInstance.put(`/admin/replyComplaint/${id}`, {
        reply,
      });
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getUserNumbers = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/getUserNumbers/`
      );
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getUserNumbersForMonth = async (year:string) => {
    try {
      const response = await axiosInstance.get(
        `/admin/getUserNumbersForYear/${year}`
      );
      if (response.status === 200) showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
}
export { AdminService };

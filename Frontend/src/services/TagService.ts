import axiosInstance from "../utils/axiosInstance";
import showToast from "../utils/showToast";

class TagService {
  public static async getAll() {
    try {
      const response = await axiosInstance.get("/admin/getTags/1");
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching tags");
    }
  }

  public static async create(tag: any) {
    try {
      const response = await axiosInstance.post("/admin/createTag", tag);
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error creating tags");
    }
  }

  public static async update(tag: any) {
    try {
      const response = await axiosInstance.put(`/admin/updateTag`, tag);
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error updating tags");
    }
  }

  public static async delete(type: string) {
    try {
      const response = await axiosInstance.delete(`/admin/deleteTag/${type}`);
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error deleting tags");
    }
  }
}

export default TagService;

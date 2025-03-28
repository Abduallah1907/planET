import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class CategoryService {
  public static async getAll() {
    try {
      const response = await axiosInstance.get("/category/getAllCategories");

      return response.data;
    } catch (error) {
      throw new Error("Error fetching categories");
    }
  }

  public static async create(category: any) {
    try {
      const response = await axiosInstance.post(
        "/category/createCategory",
        category
      );
      if (response.status === 201) showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error creating category");
    }
  }

  public static async update(id: string, category: any) {
    try {
      const response = await axiosInstance.put(
        `/category/updateCategory/${id}`,
        category
      );
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error updating category");
    }
  }

  public static async delete(id: string) {
    try {
      const response = await axiosInstance.delete(
        `/category/deleteCategory/${id}`
      );
      if (response.status === 200) showToast(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error deleting category");
    }
  }
  public static async getCategoryById(id: number) {
    try {
      const response = await axiosInstance.get(`/admin/getCategories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching category by ID");
    }
  }
}

export default CategoryService;

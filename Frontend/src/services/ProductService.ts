import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import showToast from "../../src/utils/showToast";

class ProductService {
  public static getAllProducts = async () => {
    try {
      const response = await axiosInstance.get("/product/getAllProducts");
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getProductsBySellerId = async (seller_id: string) => {
    try {
      const response = await axiosInstance.get(
        `/product/getProductsBySellerId/${seller_id}`
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getProductByName = async (name: string) => {
    try {
      const response = await axiosInstance.get(
        `/product/getProductByName/${name}`
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getFilteredProducts = async (filter: any) => {
    try {
      const response = await axiosInstance.get("/product/getFilteredProducts", {
        params: filter,
      });
      showToast(response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static getFilterComponents = async () => {
    try {
      const response = await axiosInstance.get("/product/getFilterComponents/");
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static createProduct = async (seller_id: string, productData: any) => {
    try {
      const response = await axiosInstance.post(
        `/product/createProduct/${seller_id}`,
        productData
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static EditProduct = async (product_id: string, productData: any) => {
    try {
      const response = await axiosInstance.put(
        `/product/UpdateProduct/${product_id}`,
        productData
      );
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  public static getProductById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/product/getProductByID/${id}`);
      showToast(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}
export { ProductService };

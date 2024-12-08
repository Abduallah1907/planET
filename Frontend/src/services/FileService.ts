import axiosInstance from "../utils/axiosInstance";
class FileService {
  public static uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public static downloadFile = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/file/download/${id}`, {
        responseType: "blob", // Ensure response is treated as a blob
      });
      return response.data; // Return the blob data
    } catch (error) {
      throw error;
    }
  };
}

export { FileService };

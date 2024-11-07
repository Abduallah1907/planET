import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class SkyscannerService {
  public static async searchLocations(query: string): Promise<any> {
    const repsonse = await axiosInstance.get("/skyscanner/locations", {
      params: {
        keyword: query,
      },
    });
    showToast(repsonse.data);
    return repsonse.data;
  }
}

export default SkyscannerService;

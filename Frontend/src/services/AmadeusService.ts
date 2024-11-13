import axiosInstance from "../utils/axiosInstance";
import showToast from "../../src/utils/showToast";

class AmadeusService {

  public static searchAirports(query: string): Promise<any> {
    return axiosInstance.get("/amadeus/airports", {
      params: {
        keyword: query,
      },
    });
  }

  public static async searchFlights(data: object) {
    const response = await axiosInstance.get('/amadeus/flightOffers', { params: data });
    return response.data;
  }

  public static async getFlightPrice(data: object) {
    const response = await axiosInstance.post('/amadeus/flightPrice', data);
    return response.data;
  }

  public static async bookFlight(data: object) {
    const response = await axiosInstance.post('/amadeus/bookFlight', data);
    return response.data;
  }

  public static async searchHotels(data: object) {
    const response = await axiosInstance.get('/amadeus/hotelOffers', { params: data });
    return response.data;
  }

}

export default AmadeusService;

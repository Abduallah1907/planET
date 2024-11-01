import axiosInstance from '../utils/axiosInstance';

class AmadeusService {

    public static searchAirports(query: string): Promise<any> {
        return axiosInstance.get('/amadeus/airports', {
            params: {
                keyword: query,
            }
        });
    }

    public static async searchFlights(data: object) {
        const response = await axiosInstance.get('/amadeus/flightOffers', { params: data });
        return response.data;
    }

}

export default AmadeusService;
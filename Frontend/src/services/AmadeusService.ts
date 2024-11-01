import axiosInstance from '../utils/axiosInstance';

class AmadeusService {

    public static searchAirports(query: string): Promise<any> {
        return axiosInstance.get('/amadeus/airports', {
            params: {
                keyword: query,
            }
        });
    }

}

export default AmadeusService;
import axiosInstance from '../utils/axiosInstance';

class SkyscannerService{
    public static searchLocations(query: string): Promise<any> {
        return axiosInstance.get('/skyscanner/locations', {
            params: {
                keyword: query,
            }
        });
    }
}

export default SkyscannerService;
import axios from 'axios';
import { Service } from 'typedi';
@Service()
export default class SkyscannerService {

    private getType(location: any) {
        if(location.AirportInformation){
            return "AIRPORT";
        }
        // Check if the record is a country
        if (!location.CityId && !location.IataCode && location.CountryId === location.PlaceId) {
            return "COUNTRY";
        }

        // Check if the record is a city
        if (location.CityId && location.IataCode) {
            return "CITY";
        }

        // Check if the record is an airport (CityId exists but no IataCode, and ResultingPhrase has airport code)
        if (location.CityId && !location.IataCode && /\([A-Z]{3}\)/.test(location.ResultingPhrase)) {
            return "AIRPORT";
        }

        // Default fallback
        return "unknown";
    }



    async getLocationsService(keyword: string, type: string) {
        try {
            const response = await axios.get(`https://www.skyscanner.net/g/autosuggest-search/api/v1/search-flight/EG/en-GB/${keyword}?isDestination=false&enable_general_search_v2=true`);
            // const response = await axios.get(`https://www.skyscanner.net/g/autosuggest-search/api/v1/search-flight/EG/en-GB/${keyword}?isDestination=false`);
            const locations = response.data.map((location: any) => {
                return {
                    ...location,
                    Type: this.getType(location),
                }
            });
            const locationsTransformed = locations.map((location: any) => {
                const { IataCode, AirportInformation, ...restLocation } = location;
                return {
                    ...restLocation,
                    IataCode: location.Type === "AIRPORT" || location.Type === "COUNTRY" ? location.PlaceId : IataCode,
                    AirportInformation: AirportInformation ? { ...AirportInformation, IataCode: location.AirportInformation.PlaceId } : undefined
                }
            });
            if (type) {
                return locationsTransformed.filter((location: any) => location.Type === type).slice(0, 5);
            }
            return locationsTransformed.slice(0, 5);
        } catch (error) {
            throw error;
        }
    }
}
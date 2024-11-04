import config from '@/config';
import { Service } from 'typedi';
import Amadeus, { FlightOffersSearchGetParams, HotelOffersSearchParams, ReferenceDataLocationsHotelsByCityParams } from 'amadeus-ts';
import Response from '@/types/responses/response';

@Service()
export default class AmadeusService {
    private amadeus: Amadeus;

    constructor() {
        this.amadeus = new Amadeus({
            clientId: config.amadeus.clientID,
            clientSecret: config.amadeus.clientSecret
        });
    }

    public async getAirportsBykeywordService(keyword: string) {
        try {
            const response = await this.amadeus.referenceData.locations.get({
                subType: 'AIRPORT,CITY',
                keyword: keyword,
                view: 'LIGHT',
                page: {
                    limit: 5
                }
            });
            return new Response(true, response.data, 'Airports Fetched successfully', 200);
        } catch (error) {
            throw error;
        }
    }

    public async getFlightOffersService(params: FlightOffersSearchGetParams){
        try{
            const response = await this.amadeus.shopping.flightOffersSearch.get(params);
            return new Response(true, response.data, 'Flight Offers Fetched successfully', 200);
        } catch (error){
            throw error;
        }
    }

    public async getHotelsListService(params: ReferenceDataLocationsHotelsByCityParams){
        try {
            const response = await this.amadeus.referenceData.locations.hotels.byCity.get(params);
            return new Response(true, response.data, 'Hotels List Fetched successfully', 200);
        } catch (error){
            throw error;
        }
    }

    public async getHotelOffersService(params: HotelOffersSearchParams){
        try {
            const response = await this.amadeus.shopping.hotelOffersSearch.get(params);
            return new Response(true, response.data, 'Hotel Offers Fetched successfully', 200);
        } catch (error){
            throw error;
        }
    }
}
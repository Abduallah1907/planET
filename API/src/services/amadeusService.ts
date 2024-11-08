import config from "@/config";
import { Service } from "typedi";
import Amadeus, {
  FlightOffersPricingParams,
  FlightOffersSearchGetParams,
  FlightOrdersParams,
  HotelOffersSearchParams,
  ReferenceDataLocationsHotelsByCityParams,
} from "amadeus-ts";
import Response from "@/types/responses/response";

@Service()
export default class AmadeusService {
  private amadeus: Amadeus;

  constructor() {
    this.amadeus = new Amadeus({
      clientId: config.amadeus.clientID,
      clientSecret: config.amadeus.clientSecret,
    });
  }

  public async getAirportsBykeywordService(keyword: string) {
    try {
      const response = await this.amadeus.referenceData.locations.get({
        subType: "AIRPORT,CITY",
        keyword: keyword,
        view: "LIGHT",
        page: {
          limit: 5,
        },
      });

      return {
        success: true,
        data: response.data,
        message: "Airports Fetched successfully",
        status: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getFlightOffersService(params: FlightOffersSearchGetParams) {
    try {
      const response = await this.amadeus.shopping.flightOffersSearch.get(params);
      return new Response(true, response.data, 'Flight Offers Fetched successfully', 200);
    } catch (error) {
      throw error;
    }
  }

  public async getFlightPriceService(params: FlightOffersPricingParams) {
    try {
      const response = await this.amadeus.shopping.flightOffers.pricing.post(params)
      return new Response(true, response.data, 'Flight Price Fetched successfully', 200);
    } catch (error) {
      throw error;
    }
  }

  public async bookFlightService(params: FlightOrdersParams) {
    try {
      const response = await this.amadeus.booking.flightOrders.post(params);
      return new Response(true, response.data, 'Flight Booked successfully', 200);
    } catch (error) {
      throw error;
    }
  }

  public async getHotelsListService(
    params: ReferenceDataLocationsHotelsByCityParams
  ) {
    try {
      const response =
        await this.amadeus.referenceData.locations.hotels.byCity.get(params);
      return {
        success: true,
        data: response.data,
        message: "Hotels List Fetched successfully",
        status: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getHotelOfferService(params: HotelOffersSearchParams) {
    try {
      const response = await this.amadeus.shopping.hotelOffersSearch.get(params);
      return new Response(true, response.data, 'Hotel Offers Fetched successfully', 200);
    } catch (error) {
      throw error;
    }
  }

  public async getHotelOffersService(params: ReferenceDataLocationsHotelsByCityParams, hotelOffersParams: HotelOffersSearchParams) {
    try {
      const hotelsList = await this.getHotelsListService(params);
      const hotels = hotelsList.data;
      const hotelIdsString = hotels.map((hotel: any) => hotel.hotelId).join();
      const { hotelIds, ...restHotelOffersParams } = hotelOffersParams;
      const searchParams = {
        hotelIds: hotelIdsString,
        ...restHotelOffersParams
      };
      const response = await this.amadeus.shopping.hotelOffersSearch.get(searchParams);
      return new Response(true, response.data, 'Hotel Offers Fetched successfully', 200);
    } catch (error) {
      throw error;
    }
  }

}

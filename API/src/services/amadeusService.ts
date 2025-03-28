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

  public async getHotelRatings(params: any) {
    try {
      const response = await this.amadeus.eReputation.hotelSentiments.get(params);
      return new Response(true, response.data, 'Hotel Ratings Fetched successfully', 200);
    } catch (error) {
      throw error;
    }
  }

  public async getHotelOffersService(params: ReferenceDataLocationsHotelsByCityParams, hotelOffersParams: HotelOffersSearchParams) {
    try {
      const hotelsList = await this.getHotelsListService(params);
      const hotels = hotelsList.data;
      const hotelIdsArray = hotels.map((hotel: any) => hotel.hotelId);
      const hotelIdsString = hotels.map((hotel: any) => hotel.hotelId).join();
      const { hotelIds, ...restHotelOffersParams } = hotelOffersParams;
      const MAX_HOTEL_IDS = 10; // Adjust this value based on the API's maximum allowed hotel IDs per request

      let allHotelOffers: any[] = [];

      const maxHotels = hotelIdsArray.length > 30 ? 30 : hotelIdsArray.length;
      for (let i = 0; i < maxHotels; i += MAX_HOTEL_IDS) {
        const hotelIdsChunk = hotelIdsArray.slice(i, i + MAX_HOTEL_IDS).join();
        const searchParams = {
          hotelIds: hotelIdsChunk,
          ...restHotelOffersParams
        };
        try {
          const response = await this.amadeus.shopping.hotelOffersSearch.get(searchParams);
          allHotelOffers = allHotelOffers.concat(response.data);
        } catch (error) {
          throw error;
        }
      }
      allHotelOffers.forEach((hotelOffer: any) => {
        const randomRatings = Math.floor(Math.random() * 100) + 1;
        const randomReviews = Math.floor(Math.random() * 2000) + 1;
        hotelOffer.hotel.rating = {
          overallRating: randomRatings,
          numberOfReviews: randomReviews,
          numberOfRatings: randomReviews,
        }
      });
      return new Response(true, allHotelOffers, 'Hotel Offers Fetched successfully', 200);
    } catch (error) {
      throw error;
    }
  }

}

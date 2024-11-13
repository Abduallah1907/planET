import AmadeusService from '@/services/amadeusService';
import { Service, Container } from 'typedi';

@Service()
export default class AmadeusController{
    
    public async getAirportsBykeyword(req: any, res: any){
        const { keyword } = req.query;
        const amadeusService: AmadeusService = Container.get(AmadeusService);
        const airports = await amadeusService.getAirportsBykeywordService(keyword);
        res.status(airports.status).json(airports);
    }

    public async getFlightOffers(req: any, res: any){
        const amadeusService: AmadeusService = Container.get(AmadeusService);
        const flightOffers = await amadeusService.getFlightOffersService(req.query);
        res.status(flightOffers.status).json(flightOffers);
    }

    public async getFlightPrice(req: any, res: any) {
        const amadeusService: AmadeusService = Container.get(AmadeusService);
        const flightPrice = await amadeusService.getFlightPriceService(req.body);
        res.status(flightPrice.status).json(flightPrice);
    }

    public async bookFlight(req: any, res: any) {
        const amadeusService: AmadeusService = Container.get(AmadeusService);
        const flightBooking = await amadeusService.bookFlightService(req.body);
        res.status(flightBooking.status).json(flightBooking);
    }

    public async getHotelsList(req: any, res: any){
        const amadeusService: AmadeusService = Container.get(AmadeusService);
        const hotelsList = await amadeusService.getHotelsListService(req.query);
        res.status(hotelsList.status).json(hotelsList);
    }

    public async getHotelOffers(req: any, res: any){
        const amadeusService: AmadeusService = Container.get(AmadeusService);
        const { cityCode, chainCodes, amenities, ratings, adults, checkInDate, checkOutDate, roomQuantity, priceRange, currencyCode, paymentPolicy, boardType, lang } = req.query;
        const hotelListParams = { cityCode, chainCodes, amenities, ratings };
        const hotelOffersParams = { hotelIds: "", adults, checkInDate, checkOutDate, roomQuantity, priceRange, currencyCode, paymentPolicy, boardType, lang };
        const hotelOffers = await amadeusService.getHotelOffersService(hotelListParams, hotelOffersParams);
        res.status(hotelOffers.status).json(hotelOffers);
    }


}
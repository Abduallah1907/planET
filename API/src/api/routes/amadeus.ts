import { Router } from "express";
import Container from "typedi";
import AmadeusController from "../controllers/amadeusController";
const router = Router();

export default (app: Router) => {
    const amadeusController: AmadeusController = Container.get(AmadeusController);
    app.use("/amadeus", router);

    router.get("/airports", amadeusController.getAirportsBykeyword);

    router.get("/flightOffers", amadeusController.getFlightOffers);

    router.post("/flightPrice", amadeusController.getFlightPrice);

    router.post("/bookFlight", amadeusController.bookFlight);

    router.get("/hotelsList", amadeusController.getHotelsList);

    router.get("/hotelOffers", amadeusController.getHotelOffers);

};

import { Router } from "express";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
import AmadeusController from "../controllers/amadeusController";
const router = Router();

export default (app: Router) => {
    const amadeusController: AmadeusController = Container.get(AmadeusController);
    app.use("/amadeus", router);

    router.get("/airports", amadeusController.getAirportsBykeyword);

    router.get("/flightOffers", amadeusController.getFlightOffers);

    router.get("/hotelOffers", amadeusController.getHotelOffers);

};

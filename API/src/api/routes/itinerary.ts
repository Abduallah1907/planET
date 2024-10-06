import { Router } from "express";
import Container from "typedi";
import { ItineraryController } from "../controllers/itineraryController";
const router = Router();
// all routes have /api/tourGuide before each route

export default (app: Router) => {
  const itineraryController: ItineraryController = Container.get(ItineraryController);
  app.use("/itinerary", router);

  // CRUD for itinerary
  router.post("/createItinerary", itineraryController.createItinerary);
  router.get("/getItineraryByID/:itinerary_id", itineraryController.getItineraryByID);
  router.put("/updateItinerary", itineraryController.updateItinerary);
  router.delete("/deleteItinerary/:tour_guide_user_id/itinerary/:itinerary_id", itineraryController.deleteItinerary);

  // get all itineraries
  router.get("/getItineraryByTourGuideID/:tour_guide_user_id", itineraryController.getAllItinerariesByTourGuideID);
  router.get("/getAllItineraries/:page", itineraryController.getAllItineraries);
};

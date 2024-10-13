import { Router } from "express";
import Container from "typedi";
import { ItineraryController } from "../controllers/itineraryController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();
// all routers have /api/tourGuide before each router

export default (app: Router) => {
  const itineraryController: ItineraryController = Container.get(ItineraryController);
  app.use("/itinerary", router);

  // CRUD for itinerary
  router.post("/createItinerary", authorize([UserRoles.TourGuide]), itineraryController.createItinerary);
  router.get("/getItineraryByID/:itinerary_id", authorize([UserRoles.TourGuide]), itineraryController.getItineraryByID);
  router.put("/updateItinerary/:itinerary_id", authorize([UserRoles.TourGuide]), itineraryController.updateItinerary);
  router.delete("/deleteItinerary/:itinerary_id", authorize([UserRoles.TourGuide]), itineraryController.deleteItinerary);

  // get all itineraries
  router.get("/getAllItinerariesByTourGuideID/:tour_guide_id", authorize([UserRoles.TourGuide]), itineraryController.getAllItinerariesByTourGuideID);
  router.get("/getAllItineraries/:page", itineraryController.getAllItineraries);

  router.get("/getSortedItineraries", itineraryController.getSortedItineraries);

  router.get("/getSearchItinerary", itineraryController.getSearchItinerary);

  router.get("/getUpcomingItineraries", itineraryController.getUpcomingItineraries);

  router.get("/getFilteredItineraries", itineraryController.getFilteredItineraries);
  router.get("/getFilterComponents", itineraryController.getFilterComponents);
};

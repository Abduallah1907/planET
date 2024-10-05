import { Router } from "express";
import { TourGuideController } from "../controllers/tourGuideController";
import Container from "typedi";
const router = Router();
// all routes have /api/tourGuide before each route

export default (app: Router) => {
  /**
   * @swagger
   * servers:
   *   - url: http://localhost:xxxx/api/tourGuide
   * tags:
   *   - name: Tour guide
   *     description: Tour guide account management
   * /api/tourist/getTourist:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve tourist from system
   *     description: Retrieve data of tourist by mail
   *     responses:
   *       200:
   *         description: Tourist data.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   *
   */
  const tourGuideController: TourGuideController = Container.get(TourGuideController);
  app.use("/tourGuide", router);
  // CRUD for work experience
  router.post("/createPreviousWork", tourGuideController.createPreviousWork);
  router.put("/updatePreviousWork", tourGuideController.updatePreviousWork);
  router.delete("/deletePreviousWork/:tour_guide_user_id/previousWork/:previous_work_id", tourGuideController.deletePreviousWork);
  // Read and update for profile
  /**
   * The reason we do not have a create profile (only update/view) is due to the fact
   * that when the tour guide registers, we create a document for him inside the User table AND
   * the tour guide table. This is because in sprint 2, tour guide has documents he is
   * required to add, which is only avaliable in the tour guide table. This makes creating a profile
   * unneccessary. We could have a create profile as a helper api call to the main register api call, or
   * move documents to user, or just leave it out commented as is.
   */
  //router.post("/createProfile");
  router.get("/getProfile/:tour_guide_user_id", tourGuideController.getProfile);
  router.put("/updateProfile", tourGuideController.updateProfile);

  // CRUD for itinerary
  router.post("/createItinerary", tourGuideController.createItinerary);
  router.get("/getItinerary/:itinerary_id", tourGuideController.getItinerary);
  router.put("/updateItinerary", tourGuideController.updateItinerary);
  router.delete("/deleteItinerary/:tour_guide_user_id/itinerary/:itinerary_id", tourGuideController.deleteItinerary);

  // get all itineraries
  router.get("/getItineraries/:tour_guide_user_id", tourGuideController.viewAllItineraries);
};

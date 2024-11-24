import { Router } from "express";
import { TourGuideController } from "../controllers/tourGuideController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();
// all routes have /api/tourGuide before each route

export default (app: Router) => {
  const tourGuideController: TourGuideController =
    Container.get(TourGuideController);
  app.use("/tourGuide", router);
  // CRUD for work experience
  router.post(
    "/createPreviousWork",
    authorize([UserRoles.TourGuide]),
    tourGuideController.createPreviousWork
  );
  router.put(
    "/updatePreviousWork",
    authorize([UserRoles.TourGuide]),
    tourGuideController.updatePreviousWork
  );
  router.delete(
    "/deletePreviousWork/:tour_guide_id/previousWork/:previous_work_id",
    authorize([UserRoles.TourGuide]),
    tourGuideController.deletePreviousWork
  );
  // Create, Read and update for profile
  router.post("/createProfile", tourGuideController.createProfile);
  router.get(
    "/getProfile/:email",
    authorize([UserRoles.TourGuide]),
    tourGuideController.getProfile
  );
  router.put(
    "/updateProfile/:email",
    authorize([UserRoles.TourGuide]),
    tourGuideController.updateProfile
  );

  router.delete(
    "/deleteTourGuideAccountRequest/:email",
    tourGuideController.deleteTourGuideAccountRequest
  );
  router.get("/getSalesReport/:email", tourGuideController.getSalesReport);
};

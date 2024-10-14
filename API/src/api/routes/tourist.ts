import { Router } from "express";
import Container from "typedi";
import { TouristController } from "../controllers/touristController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const route = Router();

export default (app: Router) => {
  const touristController: TouristController = Container.get(TouristController);

  app.use("/tourist", route);
  route.get("/getTourist/:email", authorize([UserRoles.Tourist]), touristController.getTourist);
  route.put("/updateTourist/:searchEmail", authorize([UserRoles.Tourist]), touristController.updateTourist);
  route.post("/createTourist", touristController.createTourist);
  route.post("/rateandcommentTourGuide/:tourist_id", authorize([UserRoles.Tourist]), touristController.rateandcommentTour_guide);
  route.post("/rateandcommentItinerary/:tourist_id", authorize([UserRoles.Tourist]), touristController.rateandcommentItinerary);
  route.post("/rateandcommentActivity/:tourist_id", authorize([UserRoles.Tourist]), touristController.rateandcommentActivity);

  route.delete("/deleteTouristAccountRequest/:email", touristController.deleteTouristAccountRequest);
};

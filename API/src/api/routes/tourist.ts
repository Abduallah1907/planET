import { Router } from "express";
import Container from "typedi";
import { TouristController } from "../controllers/touristController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const route = Router();

export default (app: Router) => {
  const touristController: TouristController = Container.get(TouristController);

  app.use("/tourist", route);
  route.get(
    "/getTourist/:email",
    authorize([UserRoles.Tourist]),
    touristController.getTourist
  );
  route.put(
    "/updateTourist/:searchEmail",
    authorize([UserRoles.Tourist]),
    touristController.updateTourist
  );
  route.post("/createTourist", touristController.createTourist);
  route.post(
    "/rateandcommentTourGuide/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.rateandcommentTour_guide
  );
  route.post(
    "/rateandcommentItinerary/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.rateandcommentItinerary
  );
  route.post(
    "/rateandcommentActivity/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.rateandcommentActivity
  );

  route.post("/bookActivity", touristController.bookActivity);

  route.post("/bookItinerary", touristController.bookItinerary);

  route.post(
    "/bookHistoricalLocation",
    touristController.bookHistoricalLocation
  );

  route.put(
    "/recievePoints",
    authorize([UserRoles.Tourist]),
    touristController.recievePoints
  );

  route.put(
    "/recieveBadge",
    authorize([UserRoles.Tourist]),
    touristController.recieveBadge
  );
  route.put("/redeemPoints/:email", touristController.redeemPoints);
  route.get(
    "/checkTourGuide/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.checkTourGuide
  );
  route.get(
    "/checkItinerary/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.checkItinerary
  );
  route.get(
    "/checkActivity/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.checkActivity
  );
  route.post(
    "/fileComplaint/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.fileComplaint
  );
  route.get(
    "/viewComplaints/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.viewComplaints
  );
  route.get(
    "/flagtoRateandcommentProduct/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.flagtoRateandcommentProduct
  );
  route.post(
    "/rateandcommentProduct/:tourist_id",
    authorize([UserRoles.Tourist]),
    touristController.RateandcommentProduct
  );
};

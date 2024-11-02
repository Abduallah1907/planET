import { Router } from "express";
import { AdvertiserController } from "../controllers/advertiserController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();

export default (app: Router) => {
  const advertiserController: AdvertiserController = Container.get(AdvertiserController);

  app.use("/advertiser", router);

  router.post("/createAdvertiser", advertiserController.createAdvertiserController);
  router.get("/getAdvertiserByEmail/:email", authorize([UserRoles.Advertiser]), advertiserController.getAdvertiserByEmailController);
  router.get("/getAllAdvertisers", advertiserController.getAllAdvertisersController);
  router.get("/getAdvertiserByID/:id", advertiserController.getAdvertiserByIDController);
  router.get("/getAdvertiserByUserID/:userID", advertiserController.getAdvertiserByUserIDController);
  router.get("/getAdvertiserByActivityID/:activityID", advertiserController.getAdvertiserByActivityIDController);
  router.put("/updateAdvertiser/:email", authorize([UserRoles.Advertiser]), advertiserController.updateAdvertiserController);
  router.post(
    "/createAdvertiserMain",
    // authorize([UserRoles.Advertiser]),
    advertiserController.createAdvertiserMainController
  );

  router.delete("/deleteAdvertiserAccountRequest/:email", advertiserController.deleteAdvertiserAccountRequest);
};

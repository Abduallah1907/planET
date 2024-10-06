import { Router } from "express";
import { AdvertiserController } from "../controllers/advertiserController";
import Container from "typedi";
const router = Router();

export default (app: Router) => {
  const advertiserController: AdvertiserController =
    Container.get(AdvertiserController);

  app.use("/advertiser", router);
  router.post(
    "/createAdvertiser",
    advertiserController.createAdvertiserController
  );
  router.get(
    "/getAllAdvertisers",
    advertiserController.getAllAdvertisersController
  );
  router.get(
    "/getAdvertiserByID/:id",
    advertiserController.getAdvertiserByIDController
  );
  router.get(
    "/getAdvertiserByUserID/:userID",
    advertiserController.getAdvertiserByUserIDController
  );
  router.get(
    "/getAdvertiserByActivityID/:activityID",
    advertiserController.getAdvertiserByActivityIDController
  );
  router.put(
    "/updateAdvertiser/:id",
    advertiserController.updateAdvertiserController
  );
  router.delete(
    "/deleteAdvertiser/:id",
    advertiserController.deleteAdvertiserController
  );
};

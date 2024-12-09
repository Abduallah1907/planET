import { Router } from "express";
import { Historical_locationController } from "../controllers/Historical_locationController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
import getRoleAndID from "../middlewares/getRole";
const router = Router();

export default (app: Router) => {
  const historical_locationController: Historical_locationController =
    Container.get(Historical_locationController);

  app.use("/historical_location", router);
  router.get(
    "/getAllHistorical_locations",
    getRoleAndID,
    historical_locationController.getAllHistorical_locationsController
  );
  router.post(
    "/createHistorical_location",
    authorize([UserRoles.Governor]),
    historical_locationController.createHistorical_locationController
  );
  router.get(
    "/getHistorical_locationByID",
    historical_locationController.getHistorical_locationByIDController
  );
  router.get(
    "/getHistorical_locationByIDForGoverner",
    authorize([UserRoles.Governor]),
    historical_locationController.getHistorical_locationByIDForGovernerController
  );
  router.get(
    "/getHistorical_locationsByGovernerID/:governer_id",
    authorize([UserRoles.Governor]),
    historical_locationController.getHistorical_locationsByGovernerIDController
  );
  router.put(
    "/updateHistorical_location/:historical_location_id",
    authorize([UserRoles.Governor]),
    historical_locationController.updateHistorical_locationController
  );
  router.delete(
    "/deleteHistorical_location/:historical_location_id",
    authorize([UserRoles.Governor]),
    historical_locationController.deleteHistorical_locationController
  );
  router.get(
    "/getSearchHistorical_location",
    getRoleAndID,
    authorize([UserRoles.Tourist]),
    historical_locationController.getSearchHistorical_location
  );

  router.get(
    "/getUpcomingHistorical_locations",
    getRoleAndID,
    historical_locationController.getUpcomingHistorical_locations
  );

  router.get(
    "/getFilteredHistorical_locations",
    getRoleAndID,
    historical_locationController.getFilteredHistorical_locations
  );
  router.get(
    "/getFilterComponents",
    getRoleAndID,
    historical_locationController.getFilterComponents
  );
  router.get(
    "/getComments/:historical_location_id",
    getRoleAndID,
    historical_locationController.getComments
  );
};

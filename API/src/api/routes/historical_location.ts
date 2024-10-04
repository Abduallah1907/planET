import { Router } from "express";
import { Historical_locationController } from "../controllers/Historical_locationController";
import Container from "typedi";
const router = Router();
export default (app: Router) => {
  const historical_locationController: Historical_locationController =
    Container.get(Historical_locationController);
  /**
   * @swagger
   * tags:
   *   - name: Historical_location
   *     description: Historical_location management and retrieval
   * paths:
   *   /api/historical_location/getAllHistorical_location:
   *     get:
   *       tags:
   *         - Historical_location
   *       summary: Get all Historical_locations
   *       responses:
   *         '200':
   *           description: A list of all historical locations.
   *         '400':
   *           description: Invalid input.
   *         '500':
   *           description: Internal Server Error.
   */

  app.use("/historical_location", router);
  router.get(
    "/getAllHistorical_location",
    historical_locationController.getAllHistorical_locationController
  );
  router.post(
    "/createHistorical_location",
    historical_locationController.createHistorical_locationController
  );
  router.get(
    "/getHistorical_locationByID/:id",
    historical_locationController.getHistorical_locationByIDController
  );
  router.get(
    "/getHistorical_locationByGovernerID/:id",
    historical_locationController.getHistorical_locationByGovernerIDController
  );
};

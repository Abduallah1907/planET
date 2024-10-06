import { Router } from "express";
import { Historical_locationController } from "../controllers/Historical_locationController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();

export default (app: Router) => {
  const historical_locationController: Historical_locationController =
    Container.get(Historical_locationController);

  /**
   * Registers routers for historical location management.
   *
   * @swagger
   * tags:
   *   - name: Historical_location
   *     description: Historical_location management and retrieval
   * paths:
   *   /api/historical_location/getAllHistorical_locations:
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
   *   /api/historical_location/createHistorical_location:
   *     post:
   *       tags:
   *         - Historical_location
   *       summary: Create a new Historical_location
   *       description: Create a new Historical_location in the system
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 governor_id:
   *                   type: string
   *                 description:
   *                   type: string
   *                 picture:
   *                   type: string
   *                 location:
   *                   type: object
   *                   properties:
   *                     longitude:
   *                       type: number
   *                     latitude:
   *                       type: number
   *                   description: JSON object with longitude and latitude
   *                 opening_hours_from:
   *                   type: string
   *                 opening_hours_to:
   *                   type: string
   *                 native_price:
   *                   type: number
   *                 foreign_price:
   *                   type: number
   *                 student_price:
   *                   type: number
   *                 tags:
   *                   type: object
   *                   properties:
   *                     tag_id:
   *                       type: string
   *                     value:
   *                       type: string
   *       responses:
   *         '200':
   *           description: Historical_location created data.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   *   /api/historical_location/getHistorical_locationByID/{historical_location_id}:
   *     get:
   *       tags:
   *         - Historical_location
   *       summary: Get Historical_location from system
   *       parameters:
   *         - in: path
   *           name: historical_location_id
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Historical_location data.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   *   /api/historical_location/updateHistorical_location/{historical_location_id}:
   *     put:
   *       tags:
   *         - Historical_location
   *       summary: Update Historical_location by ID
   *       description: Update Historical_location data by his ID
   *       parameters:
   *         - in: path
   *           name: historical_location_id
   *           required: true
   *           schema:
   *             type: string
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 description:
   *                   type: string
   *                 picture:
   *                   type: string
   *                 location:
   *                   type: object
   *                   properties:
   *                     longitude:
   *                       type: number
   *                     latitude:
   *                       type: number
   *                   description: JSON object with longitude and latitude
   *                 opening_hours_from:
   *                   type: string
   *                 opening_hours_to:
   *                   type: string
   *                 native_price:
   *                   type: number
   *                 foreign_price:
   *                   type: number
   *                 student_price:
   *                   type: number
   *                 tags:
   *                   type: object
   *                   properties:
   *                     tag_id:
   *                       type: string
   *                     value:
   *                       type: string
   *       responses:
   *         '200':
   *           description: Historical_location updated.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   *   /api/historical_location/deleteHistorical_location/{historical_location_id}:
   *     delete:
   *       tags:
   *         - Historical_location
   *       summary: Delete Historical_location by ID
   *       description: Delete Historical_location data by his ID
   *       parameters:
   *         - in: path
   *           name: historical_location_id
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Historical_location deleted.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   *   /api/historical_location/getHistorical_locationsByGovernerID/{governer_id}:
   *     get:
   *       tags:
   *         - Historical_location
   *       summary: Get Historical_location by governer ID
   *       description: Retrieve Historical_location data by his governer ID
   *       parameters:
   *         - in: path
   *           name: governer_id
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Historical_location data.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   *   /api/historical_location/getSearchHistorical_location:
   *     get:
   *       tags:
   *         - Historical_location
   *       summary: Retrieve historical locations from system
   *       description: Retrieve historical locations data by name, category, and tag
   *       parameters:
   *         - in: query
   *           name: name
   *           required: true
   *           description: Name of the historical location
   *           schema:
   *             type: string
   *         - in: query
   *           name: category
   *           description: Category of the historical location
   *           schema:
   *             type: string
   *         - in: query
   *           name: tag
   *           description: Tag of the historical location
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: List of Historical locations.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   *   /api/historical_location/getUpcomingHistorical_locations:
   *     get:
   *       tags:
   *         - Historical_location
   *       summary: Retrieve upcoming historical locations from system
   *       description: Retrieve upcoming historical locations data
   *       responses:
   *         '200':
   *           description: List of upcoming historical locations.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   *   /api/historical_location/getFilteredHistorical_locations:
   *     get:
   *       tags:
   *         - Historical_location
   *       summary: Retrieve filtered historical locations from system by tags
   *       description: Retrieve filtered historical locations data
   *       parameters:
   *         - in: query
   *           name: tags
   *           description: Tags of the historical location
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: List of filtered historical locations.
   *         '400':
   *           description: Bad request.
   *         '500':
   *           description: Internal server error.
   */

  app.use("/historical_location", router);
  router.get(
    "/getAllHistorical_locations",
    historical_locationController.getAllHistorical_locationsController
  );
  router.post(
    "/createHistorical_location",
    authorize([UserRoles.Governor]),
    historical_locationController.createHistorical_locationController
  );
  router.get(
    "/getHistorical_locationByID/:historical_location_id",
    authorize([UserRoles.Governor]),
    historical_locationController.getHistorical_locationByIDController
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
    authorize([UserRoles.Tourist]),
    historical_locationController.getSearchHistorical_location
  );

  router.get(
    "/getUpcomingHistorical_locations",
    historical_locationController.getUpcomingHistorical_locations
  );

  router.get(
    "/getFilteredHistorical_locations",
    historical_locationController.getFilteredHistorical_locations
  );
};

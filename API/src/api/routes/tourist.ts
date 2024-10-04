import { Router } from "express";
import Container from "typedi";
import { TouristController } from "../controllers/touristController";
const route = Router();

export default (app: Router) => {
  const touristController: TouristController = Container.get(TouristController);

  app.use("/tourist", route);
  /**
   * @swagger
   *
   * components:
   *  schemas:
   *    ITouristCreateDTO:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *        name:
   *          type: string
   *        username:
   *          type: string
   *        password:
   *          type: string
   *        role:
   *          type: string
   *          enum: [Tourist]
   *        phone_number:
   *          type: string
   *        date_of_birth:
   *          type: string
   *          format: date
   *    ITouristUpdateDTO:
   *      type: object
   *      properties:
   *        name:
   *          type: string
   *        newEmail:
   *          type: string
   *        password:
   *          type: string
   *        phone_number:
   *          type: string
   *        job:
   *          type: string
   *        nation:
   *          type: string
   *        addresses:
   *          type: array
   *          items:
   *            type: string
   *    ITourist:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *        name:
   *          type: string
   *        username:
   *          type: string
   *        password:
   *          type: string
   *        role:
   *          type: string
   *        phone_number:
   *          type: string
   *        date_of_birth:
   *          type: string
   *          format: date
   *    ITouristOutputDTO:
   *      type: object
   *      properties:
   *        name:
   *          type: string
   *        username:
   *          type: string
   *        email:
   *          type: string
   *        password:
   *          type: string
   *        role:
   *          type: string
   *        phone_number:
   *          type: string
   *        status:
   *          type: string
   *        date_of_birth:
   *          type: string
   *          format: date
   *        job:
   *          type: string
   *        nation:
   *          type: string
   *        wallet:
   *          type: number
   *        loyality_points:
   *          type: number
   *        badge:
   *          type: string
   *        addresses:
   *          type: array
   *          items:
   *            type: string
   *    ITouristNewUserDTO:
   *      type: object
   *      properties:
   *        user_id:
   *          type: string
   *        job:
   *          type: string
   *        nation:
   *          type: string
   *        date_of_birth:
   *          type: string
   *          format: date
   *
   * tags:
   *   - name: Tourist
   *     description: Tourist management and retrieval
   * /api/tourist/getTourist:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve tourist from system
   *     description: Retrieve data of tourist by email
   *     parameters:
   *       - in: query
   *         name: email
   *         required: true
   *         description: Email of the tourist
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Tourist data.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/updateTourist/{searchEmail}:
   *   put:
   *     tags:
   *       - Tourist
   *     summary: Update tourist in system
   *     description: Update tourist data by email
   *     parameters:
   *       - in: path
   *         name: searchEmail
   *         required: true
   *         description: Email of the tourist to update for
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the tourist
   *               newEmail:
   *                 type: string
   *                 description: New email of the tourist
   *               password:
   *                 type: string
   *                 description: Password of the tourist
   *               phone_number:
   *                 type: string
   *                 description: Phone number of the tourist
   *               job:
   *                 type: string
   *                 description: Job of the tourist
   *               nation:
   *                 type: string
   *                 description: Nation of the tourist
   *               addresses:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Addresses of the tourist
   *     responses:
   *       200:
   *         description: Updated Tourist data.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/createTourist:
   *   post:
   *     tags:
   *       - Tourist
   *     summary: Create tourist in system
   *     description: Create a new tourist in the system
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the tourist
   *               name:
   *                 type: string
   *                 description: Name of the tourist
   *               username:
   *                 type: string
   *                 description: Username of the tourist
   *               password:
   *                 type: string
   *                 description: Password of the tourist
   *               role:
   *                 type: string
   *                 description: Role of the user
   *                 enum: [Tourist]
   *               phone_number:
   *                 type: string
   *                 description: Phone number of the tourist
   *               date_of_birth:
   *                 type: string
   *                 format: date
   *                 description: Date of birth of the tourist
   *     responses:
   *       200:
   *         description: Tourist created data.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/getItineraries:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve itineraries from system
   *     description: Retrieve itineraries data by name, category, and tag
   *     parameters:
   *       - in: query
   *         name: name
   *         description: Name of the itinerary
   *         schema:
   *           type: string
   *       - in: query
   *         name: category
   *         description: Category of the itinerary
   *         schema:
   *           type: string
   *       - in: query
   *         name: tag
   *         description: Tag of the itinerary
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of Itineraries.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/getHistorical_locations:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve historical locations from system
   *     description: Retrieve historical locations data by name, category, and tag
   *     parameters:
   *       - in: query
   *         name: name
   *         required: true
   *         description: Name of the historical location
   *         schema:
   *           type: string
   *       - in: query
   *         name: category
   *         description: Category of the historical location
   *         schema:
   *           type: string
   *       - in: query
   *         name: tag
   *         description: Tag of the historical location
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of Historical locations.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/getUpcomingItineraries:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve upcoming itineraries from system
   *     description: Retrieve upcoming itineraries data
   *     responses:
   *       200:
   *         description: List of upcoming itineraries.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/getUpcomingHistorical_locations:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve upcoming historical locations from system
   *     description: Retrieve upcoming historical locations data
   *     responses:
   *       200:
   *         description: List of upcoming historical locations.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/getFitleredItineraries:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve filtered itineraries from system by preferences,budget,date
   *     description: Retrieve filtered itineraries data
   *     parameters:
   *       - in: query
   *         name: budget
   *         description: Budget for the itinerary
   *         schema:
   *           type: string
   *       - in: query
   *         name: date
   *         description: Date of the itinerary
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: preferences
   *         description: Preferences of the itinerary
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of filtered itineraries.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/tourist/getFilteredHistorical_locations:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve filtered historical locations from system by tags
   *     description: Retrieve filtered historical locations data
   *     parameters:
   *       - in: query
   *         name: tags
   *         description: Tags of the historical location
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of filtered historical locations.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   */
  route.get("/getTourist/:email", touristController.getTourist);
  route.put("/updateTourist/:searchEmail", touristController.updateTourist);
  route.post("/createTourist", touristController.createTourist);

  route.get("/getItineraries", touristController.getItinerary);
  route.get(
    "/getHistorical_locations",
    touristController.getHistorical_locations
  );

  route.get(
    "/getUpcomingItineraries",
    touristController.getUpcomingItineraries
  );
  route.get(
    "/getUpcomingHistorical_locations",
    touristController.getUpcomingHistorical_locations
  );

  route.get(
    "/getFitleredItineraries",
    touristController.getFilteredItineraries
  );

  route.get(
    "/getFilteredHistorical_locations",
    touristController.getFilteredHistorical_locations
  );
};

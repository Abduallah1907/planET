import { Router } from "express";
import Container from "typedi";
import { ItineraryController } from "../controllers/itineraryController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();
// all routers have /api/tourGuide before each router

export default (app: Router) => {
  /**
   * @swagger
   * info:
   *   title: Itinerary API
   *   version: 1.0.0
   *   description: API for managing itineraries.
   * servers:
   *   - url: http://localhost:3000/api/itinerary
   * tags:
   *   - name: Itinerary
   *     description: Operations related to itinerary management.
   * paths:
   *   /api/itinerary/createItinerary:
   *     post:
   *       tags:
   *         - Itinerary
   *       summary: Create a new itinerary for a tour guide
   *       description: Automatically adds it to the tour guide's profile too.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ItineraryCreationData'
   *       responses:
   *         201:
   *           description: Itinerary created successfully
   *         500:
   *           description: Internal server error.
   *   /api/itinerary/getItineraryByID/{itinerary_id}:
   *     get:
   *       tags:
   *         - Itinerary
   *       summary: Fetches itinerary information using the itinerary ID
   *       parameters:
   *         - name: itinerary_id
   *           in: path
   *           description: The itinerary we want to fetch.
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *             example: "6700067cce53c3263e1f8e5c"
   *       responses:
   *         200:
   *           description: Itinerary found successfully
   *         404:
   *           description: Itinerary not found.
   *         500:
   *           description: Internal server error.
   *   /api/itinerary/updateItinerary/{itinerary_id}:
   *     put:
   *       tags:
   *         - Itinerary
   *       summary: Update an itinerary for a tour guide
   *       description: Note that even information not updated should be sent inside the request body.
   *       parameters:
   *         - name: itinerary_id
   *           in: path
   *           description: The itinerary we want to update.
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *             example: "6700067cce53c3263e1f8e5c"
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ItineraryUpdateData'
   *       responses:
   *         200:
   *           description: Itinerary updated successfully
   *         404:
   *           description: Itinerary not found.
   *         500:
   *           description: Internal server error.
   *   /api/itinerary/deleteItinerary/{itinerary_id}:
   *     delete:
   *       tags:
   *         - Itinerary
   *       summary: Delete an itinerary by ID
   *       parameters:
   *         - name: itinerary_id
   *           in: path
   *           description: The itinerary we want to delete.
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *             example: "6700067cce53c3263e1f8e5c"
   *       responses:
   *         200:
   *           description: Itinerary deleted successfully
   *         404:
   *           description: Itinerary not found.
   *         500:
   *           description: Internal server error.
   *   /api/itinerary/getAllItinerariesByTourGuideID/{tour_guide_id}:
   *     get:
   *       tags:
   *         - Itinerary
   *       summary: Fetches all itineraries created by a specific tour guide
   *       parameters:
   *         - name: tour_guide_id
   *           in: path
   *           description: The one who owns the itineraries we want to see
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *       responses:
   *         200:
   *           description: Successful retrieval of itineraries
   *         404:
   *           description: Tour guide not found.
   *         500:
   *           description: Internal server error.
   *   /api/itinerary/getAllItineraries/{page}:
   *     get:
   *       tags:
   *         - Itinerary
   *       summary: Fetches all itineraries created in general
   *       parameters:
   *         - name: page
   *           in: path
   *           description: The page number
   *           required: true
   *           schema:
   *             type: number
   *             example: 2
   *       responses:
   *         200:
   *           description: Successful retrieval of itineraries
   *         500:
   *           description: Internal server error.
   * /api/itinerary/getSearchItinerary:
   *   get:
   *     tags:
   *       - Itinerary
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
   * /api/itinerary/getUpcomingItineraries:
   *   get:
   *     tags:
   *       - Itinerary
   *     summary: Retrieve upcoming itineraries from system
   *     description: Retrieve upcoming itineraries data
   *     responses:
   *       200:
   *         description: List of upcoming itineraries.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/itinerary/getFitleredItineraries:
   *   get:
   *     tags:
   *       - Itinerary
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
   * /api/itinerary/getSortedItineraries:
   *   get:
   *     tags:
   *       - Itinerary
   *     summary: Retrieve sorted itineraries from system
   *     description: Retrieve sorted itineraries data by sort and direction sort as "ratings" or "price" and direction as 1=Asc , -1=Desc
   *     parameters:
   *       - in: query
   *         name: sort
   *         description: Sort the itineraries by ratings or price
   *         schema:
   *           type: string
   *       - in: query
   *         name: direction
   *         description: Direction of the sort
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: List of sorted itineraries.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   */
  const itineraryController: ItineraryController =
    Container.get(ItineraryController);
  app.use("/itinerary", router);

  // CRUD for itinerary
  router.post(
    "/createItinerary",
    authorize([UserRoles.TourGuide]),
    itineraryController.createItinerary
  );
  router.get(
    "/getItineraryByID/:itinerary_id",
    authorize([UserRoles.TourGuide]),
    itineraryController.getItineraryByID
  );
  router.put(
    "/updateItinerary/:itinerary_id",
    authorize([UserRoles.TourGuide]),
    itineraryController.updateItinerary
  );
  router.delete(
    "/deleteItinerary/:itinerary_id",
    authorize([UserRoles.TourGuide]),
    itineraryController.deleteItinerary
  );

  // get all itineraries
  router.get(
    "/getAllItinerariesByTourGuideID/:tour_guide_id",
    authorize([UserRoles.TourGuide]),
    itineraryController.getAllItinerariesByTourGuideID
  );
  router.get("/getAllItineraries/:page", itineraryController.getAllItineraries);

  router.get("/getSortedItineraries", itineraryController.getSortedItineraries);

  router.get("/getSearchItinerary", itineraryController.getSearchItinerary);

  router.get(
    "/getUpcomingItineraries",
    itineraryController.getUpcomingItineraries
  );

  router.get(
    "/getFitleredItineraries",
    itineraryController.getFilteredItineraries
  );
};

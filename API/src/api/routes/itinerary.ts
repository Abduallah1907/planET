import { Router } from "express";
import Container from "typedi";
import { ItineraryController } from "../controllers/itineraryController";
const router = Router();
// all routes have /api/tourGuide before each route

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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   success:
   *                     type: boolean
   *                     example: true
   *                   data:
   *                     type: object
   *                     properties:
   *                       itinerary_id:
   *                         type: string
   *                         example: "67013baf11957fb4262a2fd4"
   *                   message:
   *                     type: string
   *                     example: "Itinerary created successfully!"
   *                   status:
   *                     type: integer
   *                     example: 201
   *         500:
   *           description: Internal server error.
   *
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   success:
   *                     type: boolean
   *                     example: true
   *                   data:
   *                     $ref: '#/components/schemas/ItineraryOutputData'
   *                   message:
   *                     type: string
   *                     example: "Itinerary found!"
   *                   status:
   *                     type: integer
   *                     example: 200
   *         404:
   *           description: Itinerary not found.
   *         500:
   *           description: Internal server error.
   *
   *   /api/itinerary/updateItinerary:
   *     put:
   *       tags:
   *         - Itinerary
   *       summary: Update an itinerary for a tour guide
   *       description: Note that even information not updated should be sent inside the request body.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ItineraryUpdateData'
   *       responses:
   *         200:
   *           description: Itinerary updated successfully
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   success:
   *                     type: boolean
   *                     example: true
   *                   data:
   *                     type: object
   *                     properties:
   *                       itinerary_id:
   *                         type: string
   *                         example: "67013baf11957fb4262a2fd4"
   *                   message:
   *                     type: string
   *                     example: "Itinerary updated!"
   *                   status:
   *                     type: integer
   *                     example: 200
   *         404:
   *           description: Itinerary not found.
   *         500:
   *           description: Internal server error.
   *
   *   /api/itinerary/deleteItinerary/{tour_guide_user_id}/itinerary/{itinerary_id}:
   *     delete:
   *       tags:
   *         - Itinerary
   *       summary: Delete an itinerary by ID
   *       parameters:
   *         - name: tour_guide_user_id
   *           in: path
   *           description: The owner of the itinerary
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *             example: "6700067cce53c3263e1f8e8d"
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   success:
   *                     type: boolean
   *                     example: true
   *                   data:
   *                     type: object
   *                     properties:
   *                       itinerary_id:
   *                         type: string
   *                         format: ObjectId
   *                         example: "67027e5d62d2a3c8bcb48993"
   *                   message:
   *                     type: string
   *                     example: "Itinerary deleted!"
   *                   status:
   *                     type: integer
   *                     example: 200
   *         404:
   *           description: Itinerary not found.
   *         500:
   *           description: Internal server error.
   *
   *   /api/itinerary/getItineraryByTourGuideID/{tour_guide_user_id}:
   *     get:
   *       tags:
   *         - Itinerary
   *       summary: Fetches all itineraries created by a specific tour guide
   *       parameters:
   *         - name: tour_guide_user_id
   *           in: path
   *           description: The one who owns the itineraries we want to see
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *             example: "6700067cce53c3263e1f8e5c"
   *       responses:
   *         200:
   *           description: Successful retrieval of itineraries
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   success:
   *                     type: boolean
   *                     example: true
   *                   data:
   *                     type: array
   *                     items:
   *                       $ref: '#/components/schemas/ItineraryOutputData'
   *                   message:
   *                     type: string
   *                     example: "Returning all found itineraries!"
   *                   status:
   *                     type: integer
   *                     example: 200
   *         404:
   *           description: Tour guide not found.
   *         500:
   *           description: Internal server error.
   *
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   success:
   *                     type: boolean
   *                     example: true
   *                   data:
   *                     type: array
   *                     items:
   *                       $ref: '#/components/schemas/ItineraryOutputData'
   *                   message:
   *                     type: string
   *                     example: "Page 2 of itineraries"
   *                   status:
   *                     type: integer
   *                     example: 200
   *         500:
   *           description: Internal server error.
   *
   * components:
   *   schemas:
   *     ItineraryCreationData:
   *       type: object
   *       properties:
   *         tour_guide_user_id:
   *           type: string
   *           format: objectId
   *           example: "66f9386e34b53f13d6cfefaa"
   *         name:
   *          type: string
   *          example: "The better Paris City Tour"
   *         category:
   *           type: string
   *           format: objectId
   *           example: "60c72b2f9b1d4c2e88f6f6a7"
   *         activities:
   *           type: array
   *           items:
   *             type: string
   *             format: objectId
   *           example:
   *             - "60c72b2f9b1d4c2e88f6f6a5"
   *             - "60c72b2f9b1d4c2e88f6f6a6"
   *         timeline:
   *           type: array
   *           items:
   *             type: string
   *             format: objectId
   *           example:
   *             - "60c72b2f9b1d4c2e88f6f6a7"
   *             - "60c72b2f9b1d4c2e88f6f6a8"
   *         locations:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               latitude:
   *                 type: number
   *                 format: float
   *                 example: 48.8584
   *               longitude:
   *                 type: number
   *                 format: float
   *                 example: 2.2945
   *         duration:
   *           type: string
   *           example: "3 hours"
   *         languages:
   *           type: array
   *           items:
   *             type: string
   *           example:
   *             - "English"
   *             - "French"
   *         price:
   *           type: number
   *           format: float
   *           example: 150
   *         available_dates:
   *           type: array
   *           items:
   *             type: string
   *             format: date-time
   *           example:
   *             - "2024-10-10T00:00:00Z"
   *             - "2024-10-15T00:00:00Z"
   *         accessibility:
   *           type: boolean
   *           example: true
   *         pickup_loc:
   *           type: object
   *           properties:
   *             latitude:
   *               type: number
   *               format: float
   *               example: 48.8584
   *             longitude:
   *               type: number
   *               format: float
   *               example: 2.2945
   *         drop_off_loc:
   *           type: object
   *           properties:
   *             latitude:
   *               type: number
   *               format: float
   *               example: 48.8584
   *             longitude:
   *               type: number
   *               format: float
   *               example: 2.2945
   *         tags:
   *           type: array
   *           items:
   *             type: string
   *           example:
   *             - "670270d1d608dd38e144914b"
   *             - "670270d1d608dd38e144958c"
   *
   *     ItineraryUpdateData:
   *       type: object
   *       properties:
   *         itinerary_id:
   *           type: string
   *           format: objectId
   *           example: "66f9386e34b53f13d6cfefaa"
   *         name:
   *           type: string
   *           example: "The better Paris City Tour"
   *         category:
   *           type: string
   *           format: objectId
   *           example: "60c72b2f9b1d4c2e88f6f6a7"
   *         activities:
   *           type: array
   *           items:
   *             type: string
   *             format: objectId
   *           example:
   *             - "60c72b2f9b1d4c2e88f6f6a5"
   *             - "60c72b2f9b1d4c2e88f6f6a6"
   *         timeline:
   *           type: array
   *           items:
   *             type: string
   *             format: objectId
   *           example:
   *             - "60c72b2f9b1d4c2e88f6f6a7"
   *             - "60c72b2f9b1d4c2e88f6f6a8"
   *         locations:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               latitude:
   *                 type: number
   *                 format: float
   *                 example: 48.8584
   *               longitude:
   *                 type: number
   *                 format: float
   *                 example: 2.2945
   *         duration:
   *           type: string
   *           example: "3 hours"
   *         languages:
   *           type: array
   *           items:
   *             type: string
   *           example:
   *             - "English"
   *             - "French"
   *         price:
   *           type: number
   *           format: float
   *           example: 150
   *         available_dates:
   *           type: array
   *           items:
   *             type: string
   *             format: date-time
   *           example:
   *             - "2024-10-10T00:00:00Z"
   *             - "2024-10-15T00:00:00Z"
   *         accessibility:
   *           type: boolean
   *           example: true
   *         pickup_loc:
   *           type: object
   *           properties:
   *             latitude:
   *               type: number
   *               format: float
   *               example: 48.8584
   *             longitude:
   *               type: number
   *               format: float
   *               example: 2.2945
   *         drop_off_loc:
   *           type: object
   *           properties:
   *             latitude:
   *               type: number
   *               format: float
   *               example: 48.8584
   *             longitude:
   *               type: number
   *               format: float
   *               example: 2.2945
   *         tags:
   *           type: array
   *           items:
   *             type: string
   *           example:
   *             - "670270d1d608dd38e144914b"
   *             - "670270d1d608dd38e144958c"
   *
   *     ItineraryOutputData:
   *       type: object
   *       properties:
   *         itinerary_id:
   *           type: string
   *           format: objectId
   *           example: "67013baf11957fb4262a2fd4"
   *         tour_guide_id:
   *           type: string
   *           format: objectId
   *           example: "66fa7be0d5ed9e556db109bb"
   *         name:
   *           type: string
   *           example: "The better Paris City Tour"
   *         activities:
   *           type: array
   *           items:
   *             type: string
   *             format: objectId
   *           example:
   *             - "60c72b2f9b1d4c2e88f6f6a5"
   *             - "60c72b2f9b1d4c2e88f6f6a6"
   *         category:
   *           type: string
   *           format: objectId
   *           example: "60c72b2f9b1d4c2e88f6f6a7"
   *         tags:
   *           type: array
   *           items:
   *             type: string
   *           example:
   *             - "670270d1d608dd38e144914b"
   *             - "670270d1d608dd38e144958c"
   *
   *         available_dates:
   *           type: array
   *           items:
   *             type: string
   *             format: date-time
   *           example:
   *             - "2024-10-10T00:00:00Z"
   *             - "2024-10-15T00:00:00Z"
   *         comments:
   *           type: array
   *           items:
   *             type: string
   *           example: []
   *         drop_off_loc:
   *           type: object
   *           properties:
   *             longitude:
   *               type: number
   *               format: float
   *               example: 2.3376
   *             latitude:
   *               type: number
   *               format: float
   *               example: 48.8606
   *             _id:
   *               type: string
   *               format: objectId
   *               example: "67013baf11957fb4262a2fd8"
   *         languages:
   *           type: array
   *           items:
   *             type: string
   *           example:
   *             - "English"
   *             - "French"
   *         locations:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               longitude:
   *                 type: number
   *                 format: float
   *                 example: 2.2945
   *               latitude:
   *                 type: number
   *                 format: float
   *                 example: 48.8584
   *               _id:
   *                 type: string
   *                 format: objectId
   *                 example: "67013baf11957fb4262a2fd5"
   *         pickup_loc:
   *           type: object
   *           properties:
   *             longitude:
   *               type: number
   *               format: float
   *               example: 2.3376
   *             latitude:
   *               type: number
   *               format: float
   *               example: 48.8606
   *             _id:
   *               type: string
   *               format: objectId
   *               example: "67013baf11957fb4262a2fd7"
   *         timeline:
   *           type: array
   *           items:
   *             type: string
   *             format: objectId
   *           example:
   *             - "60c72b2f9b1d4c2e88f6f6a7"
   *             - "60c72b2f9b1d4c2e88f6f6a8"
   *
   */
  const itineraryController: ItineraryController = Container.get(ItineraryController);
  app.use("/itinerary", router);

  // CRUD for itinerary
  router.post("/createItinerary", itineraryController.createItinerary);
  router.get("/getItineraryByID/:itinerary_id", itineraryController.getItineraryByID);
  router.put("/updateItinerary", itineraryController.updateItinerary);
  router.delete("/deleteItinerary/:tour_guide_user_id/itinerary/:itinerary_id", itineraryController.deleteItinerary);

  // get all itineraries
  router.get("/getItineraryByTourGuideID/:tour_guide_user_id", itineraryController.getAllItinerariesByTourGuideID);
  router.get("/getAllItineraries/:page", itineraryController.getAllItineraries);
};

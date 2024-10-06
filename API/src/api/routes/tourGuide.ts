import { Router } from "express";
import { TourGuideController } from "../controllers/tourGuideController";
import Container from "typedi";
const router = Router();
// all routes have /api/tourGuide before each route

export default (app: Router) => {
  /**
   * @swagger
   * info:
   *   title: Tour Guide API
   *   version: 1.0.0
   *   description: API for managing itineraries and profile for tour guide
   * servers:
   *   - url: http://localhost:xxxx/api/tourGuide
   * tags:
   *   - name: Tour Guide Profile
   *     description: Tour guide account management
   *   - name: Itinerary
   *     description: CRUD for itineraries
   * paths:
   *   /api/tourGuide/createPreviousWork:
   *     post:
   *      tags:
   *       - Tour Guide Profile
   *      summary: Adds previous work for a tour guide
   *      description: Anytime previous work needs to be added to a profile, this should be called instead of using the API for the update profile. This, given the tour guide USER id and data about the previous work, will automatically create it in the previous work table and add it to the tour guide.
   *      requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                   example: el ektshaf abo el hol
   *                 place:
   *                   type: string
   *                   example: Pyramids
   *                 from:
   *                   type: string
   *                   format: date
   *                 to:
   *                   type: string
   *                   format: date
   *                 tour_guide_user_id:
   *                   type: string
   *                   format: objectId
   *                   example: 66f9386e34b53f13d6cfefaa
   *      responses:
   *        201:
   *          description: Work experience created successfully
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     previous_work_id:
   *                       type: string
   *                       example: "6700d80b347ffedb54ee30d2"
   *                     title:
   *                       type: string
   *                       example: "el ektshaf abo el hol"
   *                     place:
   *                       type: string
   *                       example: "Pyramids"
   *                     from:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-05-15T00:00:00.000Z"
   *                     to:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-05-17T00:00:00.000Z"
   *                 message:
   *                   type: string
   *                   example: "Work experience created successfully!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        404:
   *          description: Did not find the tour guide using the user ID.
   *        500:
   *          description: Internal server error.
   *
   *   /api/tourGuide/updatePreviousWork:
   *     put:
   *      tags:
   *       - Tour Guide Profile
   *      summary: Updates previous works
   *      description: This takes in all the information about the previous work and updates them. Note that even old information needs to be sent, otherwise it will be overwritten to be empty
   *      requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 title:
   *                   type: string
   *                   example: el sar2 abo el hol
   *                 place:
   *                   type: string
   *                   example: Pyramids
   *                 from:
   *                   type: string
   *                   format: date
   *                 to:
   *                   type: string
   *                   format: date
   *                 previous_work_id:
   *                   type: string
   *                   format: objectId
   *                   example: 66f9386e34b53f13d6cfefaa
   *      responses:
   *        201:
   *          description: Work experience updated succesfully
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     previous_work_id:
   *                       type: string
   *                       example: "6700d80b347ffedb54ee30d2"
   *                     title:
   *                       type: string
   *                       example: "el sar2 abo el hol"
   *                     place:
   *                       type: string
   *                       example: "Pyramids"
   *                     from:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-05-15T00:00:00.000Z"
   *                     to:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-05-17T00:00:00.000Z"
   *                 message:
   *                   type: string
   *                   example: "Previous work updated!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        404:
   *          description: Did not find the previous work using the work ID.
   *        500:
   *          description: Internal server error.
   *
   *   /api/tourGuide/deletePreviousWork/{tour_guide_user_id}/previousWork/{previous_work_id}:
   *     delete:
   *      tags:
   *       - Tour Guide Profile
   *      summary: Deletes previous work
   *      description: Only needs the ids, and it will delete it from the table and remove object id reference to it in the tour guide
   *      parameters:
   *       - name: tour_guide_user_id
   *         in: path
   *         description: The owner of the previous work to delete.
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *           example: 6700067cce53c3263e1f8e5c
   *       - name: previous_work_id
   *         in: path
   *         description: The previous work we want to delete.
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *           example: 6700dc8780d35b7805f1cfd0
   *      responses:
   *        201:
   *          description: Previous work is deleted
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     previous_work_id:
   *                       type: string
   *                       example: "6700d80b347ffedb54ee30d2"
   *                     title:
   *                       type: string
   *                       example: "el ektshaf abo el hol"
   *                 message:
   *                   type: string
   *                   example: "Previous work deleted"
   *                 status:
   *                   type: integer
   *                   example: 200
   *        404:
   *          description: Did not find the previous work/tour guide using the work/tour guide ID.
   *        500:
   *          description: Internal server error.
   *   /api/tourGuide/createProfile:
   *     put:
   *       tags:
   *         - Tour Guide Profile
   *       summary: Registers and creates the tour guide profile
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 username:
   *                   type: string
   *                   example: zeinator
   *                 email:
   *                   type: string
   *                   example: zeina@gmail.com
   *                 phone_number:
   *                   type: string
   *                   example: 0111111
   *                 name:
   *                   type: string
   *                   example: Zeina
   *                 password:
   *                   type: string
   *                   example: secreetpassword
   *       responses:
   *        201:
   *          description: Succesful creation of profile
   *          content:
   *           application/json:
   *             schema:
   *             type: object
   *             properties:
   *               success:
   *                 type: boolean
   *                 example: true
   *               data:
   *                 type: object
   *                 properties:
   *                   tour_guide_user_id:
   *                     type: string
   *                     example: "6702481bfe08b9a3f6556ea1"
   *               message:
   *                 type: string
   *                 example: "Tour guide created"
   *               status:
   *                 type: integer
   *                 example: 201
   *        500:
   *          description: Internal server error.
   *   /api/tourGuide/getProfile/{tour_guide_user_id}:
   *     get:
   *       tags:
   *         - Tour Guide Profile
   *       summary: Fetches information about the tour guide's profile
   *       description: This returns everything about the user
   *       parameters:
   *       - name: tour_guide_user_id
   *         in: path
   *         description: The owner of said profile.
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *           example: 6700067cce53c3263e1f8e5c
   *       responses:
   *        201:
   *          description: Succesful reterival of profile
   *          content:
   *           application/json:
   *             schema:
   *              type: object
   *              properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/TourGuideOutput'
   *                 message:
   *                   type: string
   *                   example: "Itinerary deleted!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        404:
   *          description: Did not find the tour guide in either the tour_guide table or the user table
   *        500:
   *          description: Internal server error.
   *
   *   /api/tourGuide/updateProfile:
   *     put:
   *       tags:
   *         - Tour Guide Profile
   *       summary: Updates the year and photo of a tour guide.
   *       description: Note that even if the tour guide does not update a field, it should send the old field, otherwise it will be set to be empty. If previous work needs to be updated/created, use their respective apis and not this one
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 tour_guide_user_id:
   *                   type: string
   *                   format: objectId
   *                   example: 66f9386e34b53f13d6cfefaa
   *                 photo:
   *                   type: string
   *                   example: somethingLinking.png
   *                 years_of_experience:
   *                   type: number
   *                   example: 5
   *       responses:
   *        201:
   *          description: Succesful updating of profile
   *          content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TourGuideOutput'
   *        404:
   *          description: Did not find the tour guide in either the tour_guide table or the user table
   *        500:
   *          description: Internal server error.
   *   /api/tourGuide/createItinerary:
   *     post:
   *      tags:
   *       - Itinerary
   *       - Tour Guide Profile
   *      summary: Create a new itinerary for a tour guide
   *      description: Automatically adds it to the tour guide's profile too.
   *      requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ItineraryCreationData'
   *      responses:
   *        201:
   *          description: Itinerary created succesfully
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     itinerary_id:
   *                       type: string
   *                       example: "67013baf11957fb4262a2fd4"
   *                 message:
   *                   type: string
   *                   example: "Itinerary created successfully!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        500:
   *          description: Internal server error.
   *   /api/tourGuide/getItinerary/{itinerary_id}:
   *     get:
   *      tags:
   *       - Itinerary
   *       - Tour Guide Profile
   *      summary: Fetches an itinerary information using the itinerary id
   *      parameters:
   *       - name: itinerary_id
   *         in: path
   *         description: The itinerary we want to fetch.
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *           example: 6700067cce53c3263e1f8e5c
   *      responses:
   *        201:
   *          description: Itinerary created succesfully
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/ItineraryOutputData'
   *                 message:
   *                   type: string
   *                   example: "Itinerary found!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        404:
   *          description: Itinerary was not found.
   *        500:
   *          description: Internal server error.
   *   /api/tourGuide/updateItinerary:
   *     put:
   *      tags:
   *       - Itinerary
   *       - Tour Guide Profile
   *      summary: Update a new itinerary for a tour guide
   *      description: Note that even information not updated should be sent inside the request body, as anything missing will become empty
   *      requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ItineraryUpdateData'
   *      responses:
   *        201:
   *          description: Itinerary updated succesfully
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     itinerary_id:
   *                       type: string
   *                       example: "67013baf11957fb4262a2fd4"
   *                 message:
   *                   type: string
   *                   example: "Itinerary updated!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        404:
   *          description: Itinerary not found.
   *        500:
   *          description: Internal server error.
   *   /api/tourGuide/deleteItinerary/{tour_guide_user_id}/itinerary/{itinerary_id}:
   *     delete:
   *      tags:
   *       - Itinerary
   *       - Tour Guide Profile
   *      summary: Delete an itinerary depending on the id
   *      parameters:
   *       - name: tour_guide_user_id
   *         in: path
   *         description: The owner of the itinerary
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *           example: 6700067cce53c3263e1f8e8d
   *       - name: itinerary_id
   *         in: path
   *         description: The itinerary we want to delete.
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *           example: 6700067cce53c3263e1f8e5c
   *      responses:
   *        201:
   *          description: Itinerary created succesfully
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     itinerary_id:
   *                       type: string
   *                       example: "67013baf11957fb4262a2fd4"
   *                 message:
   *                   type: string
   *                   example: "Itinerary deleted!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        404:
   *          description: Itinerary was not found.
   *        500:
   *          description: Internal server error.
   *
   *
   *   /api/tourGuide/getItineraries/{tour_guide_user_id}:
   *     get:
   *       tags:
   *         - Itinerary
   *         - Tour Guide Profile
   *       summary: Fetches information about the tour guide's profile
   *       description: This returns everything about the user
   *       parameters:
   *       - name: tour_guide_user_id
   *         in: path
   *         description: The owner of said profile.
   *         required: true
   *         schema:
   *           type: string
   *           format: objectId
   *           example: 6700067cce53c3263e1f8e5c
   *       responses:
   *        201:
   *          description: Succesful reterival of profile
   *          content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                    $ref: '#/components/schemas/ItineraryOutputData'
   *                 message:
   *                   type: string
   *                   example: "Itinerary deleted!"
   *                 status:
   *                   type: integer
   *                   example: 201
   *        404:
   *          description: Did not find the tour guide in either the tour_guide table or the user table
   *        500:
   *          description: Internal server error.
   * components:
   *   schemas:
   *     TourGuideOutput:
   *       type: object
   *       properties:
   *         data:
   *           type: object
   *           properties:
   *             comments:
   *               type: array
   *               items:
   *                 type: string
   *                 format: objectId
   *                 example: 6701336a4619a8a929277630
   *             itineraries:
   *               type: array
   *               items:
   *                 type: string
   *                 format: objectId
   *                 example: 6701336a4619a8a929277630
   *             years_of_experience:
   *               type: integer
   *               format: int32
   *               example: 20
   *             previous_work_description:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                     format: objectId
   *                     example: 6701336a4619a8a929277630
   *                   title:
   *                     type: string
   *                   place:
   *                     type: string
   *                   from:
   *                     type: string
   *                     format: date-time
   *                   to:
   *                     type: string
   *                     format: date-time
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                   __v:
   *                     type: integer
   *             photo:
   *               type: string
   *               format: uri
   *               example: "link.png"
   *             username:
   *               type: string
   *               example: "touring"
   *             name:
   *               type: string
   *               example: "Touer"
   *     ItineraryCreationData:
   *       type: object
   *       properties:
   *         tour_guide_user_id:
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
   *             - "sightseeing"
   *             - "historical"
   *             - "guided"
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
   *             - "sightseeing"
   *             - "historical"
   *             - "guided"
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
   *             - "sightseeing"
   *             - "historical"
   *             - "guided"
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
  const tourGuideController: TourGuideController = Container.get(TourGuideController);
  app.use("/tourGuide", router);
  // CRUD for work experience
  router.post("/createPreviousWork", tourGuideController.createPreviousWork);
  router.put("/updatePreviousWork", tourGuideController.updatePreviousWork);
  router.delete("/deletePreviousWork/:tour_guide_user_id/previousWork/:previous_work_id", tourGuideController.deletePreviousWork);
  // Create, Read and update for profile
  router.post("/createProfile", tourGuideController.createProfile);
  router.get("/getProfile/:tour_guide_user_id", tourGuideController.getProfile);
  router.put("/updateProfile", tourGuideController.updateProfile);

  // CRUD for itinerary
  router.post("/createItinerary", tourGuideController.createItinerary);
  router.get("/getItinerary/:itinerary_id", tourGuideController.getItinerary);
  router.put("/updateItinerary", tourGuideController.updateItinerary);
  router.delete("/deleteItinerary/:tour_guide_user_id/itinerary/:itinerary_id", tourGuideController.deleteItinerary);

  // get all itineraries
  router.get("/getItineraries/:tour_guide_user_id", tourGuideController.viewAllItineraries);
};

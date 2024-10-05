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
   *   - name: Profile
   *     description: Tour guide account management
   *   - name: Itineraries
   *     description: CRUD for itineraries
   * paths:
   *   /createPreviousWork:
   *     post:
   *      tags:
   *       - Profile
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
   *                 newWorkExperience:
   *                   type: object
   *                   properties:
   *                     success:
   *                       type: boolean
   *                       example: true
   *                     data:
   *                       type: object
   *                       properties:
   *                         previous_work_id:
   *                           type: string
   *                           example: "6700d80b347ffedb54ee30d2"
   *                         title:
   *                           type: string
   *                           example: "el ektshaf abo el hol"
   *                         place:
   *                           type: string
   *                           example: "Pyramids"
   *                         from:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-05-15T00:00:00.000Z"
   *                         to:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-05-17T00:00:00.000Z"
   *                     message:
   *                       type: string
   *                       example: "Work experience created successfully!"
   *                     status:
   *                       type: integer
   *                       example: 201
   *        404:
   *          description: Did not find the tour guide using the user ID.
   *        500:
   *          description: Internal server error.
   *
   *   /updatePreviousWork:
   *     put:
   *      tags:
   *       - Profile
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
   *                 newWorkExperience:
   *                   type: object
   *                   properties:
   *                     success:
   *                       type: boolean
   *                       example: true
   *                     data:
   *                       type: object
   *                       properties:
   *                         previous_work_id:
   *                           type: string
   *                           example: "6700d80b347ffedb54ee30d2"
   *                         title:
   *                           type: string
   *                           example: "el sar2 abo el hol"
   *                         place:
   *                           type: string
   *                           example: "Pyramids"
   *                         from:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-05-15T00:00:00.000Z"
   *                         to:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-05-17T00:00:00.000Z"
   *                     message:
   *                       type: string
   *                       example: "Previous work updated!"
   *                     status:
   *                       type: integer
   *                       example: 201
   *        404:
   *          description: Did not find the previous work using the work ID.
   *        500:
   *          description: Internal server error.
   *
   *   /deletePreviousWork/{tour_guide_user_id}/previousWork/{previous_work_id}:
   *     delete:
   *      tags:
   *       - Profile
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
   *                 newWorkExperience:
   *                   type: object
   *                   properties:
   *                     success:
   *                       type: boolean
   *                       example: true
   *                     data:
   *                       type: object
   *                       properties:
   *                         previous_work_id:
   *                           type: string
   *                           example: "6700d80b347ffedb54ee30d2"
   *                         title:
   *                           type: string
   *                           example: "el ektshaf abo el hol"
   *                     message:
   *                       type: string
   *                       example: "Previous work deleted"
   *                     status:
   *                       type: integer
   *                       example: 200
   *        404:
   *          description: Did not find the previous work/tour guide using the work/tour guide ID.
   *        500:
   *          description: Internal server error.
   *
   */
  const tourGuideController: TourGuideController = Container.get(TourGuideController);
  app.use("/tourGuide", router);
  // CRUD for work experience
  router.post("/createPreviousWork", tourGuideController.createPreviousWork);
  router.put("/updatePreviousWork", tourGuideController.updatePreviousWork);
  router.delete("/deletePreviousWork/:tour_guide_user_id/previousWork/:previous_work_id", tourGuideController.deletePreviousWork);
  // Read and update for profile
  /**
   * The reason we do not have a create profile (only update/view) is due to the fact
   * that when the tour guide registers, we create a document for him inside the User table AND
   * the tour guide table. This is because in sprint 2, tour guide has documents he is
   * required to add, which is only avaliable in the tour guide table. This makes creating a profile
   * unneccessary. We could have a create profile as a helper api call to the main register api call, or
   * move documents to user, or just leave it out commented as is.
   */
  //router.post("/createProfile");
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

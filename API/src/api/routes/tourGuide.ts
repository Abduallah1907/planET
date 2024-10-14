import { Router } from "express";
import { TourGuideController } from "../controllers/tourGuideController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
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
   *       tags:
   *         - Tour Guide Profile
   *       summary: Adds previous work for a tour guide
   *       description: Anytime previous work needs to be added to a profile, this should be called instead of using the API for the update profile. This, given the tour guide USER id and data about the previous work, will automatically create it in the previous work table and add it to the tour guide.
   *       requestBody:
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
   *                 tour_guide_id:
   *                   type: string
   *                   format: objectId
   *                   example: 66f9386e34b53f13d6cfefaa
   *       responses:
   *         201:
   *           description: Work experience created successfully
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
   *                       previous_work_id:
   *                         type: string
   *                         example: "6700d80b347ffedb54ee30d2"
   *                       title:
   *                         type: string
   *                         example: "el ektshaf abo el hol"
   *                       place:
   *                         type: string
   *                         example: "Pyramids"
   *                       from:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-05-15T00:00:00.000Z"
   *                       to:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-05-17T00:00:00.000Z"
   *                   message:
   *                     type: string
   *                     example: "Work experience created successfully!"
   *                   status:
   *                     type: integer
   *                     example: 201
   *         404:
   *           description: Did not find the tour guide using the user ID.
   *         500:
   *           description: Internal server error.
   *   /api/tourGuide/updatePreviousWork:
   *     put:
   *       tags:
   *         - Tour Guide Profile
   *       summary: Updates previous works
   *       description: This takes in all the information about the previous work and updates them. Note that even old information needs to be sent, otherwise it will be overwritten to be empty
   *       requestBody:
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
   *       responses:
   *         201:
   *           description: Work experience updated successfully
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
   *                       previous_work_id:
   *                         type: string
   *                         example: "6700d80b347ffedb54ee30d2"
   *                       title:
   *                         type: string
   *                         example: "el sar2 abo el hol"
   *                       place:
   *                         type: string
   *                         example: "Pyramids"
   *                       from:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-05-15T00:00:00.000Z"
   *                       to:
   *                         type: string
   *                         format: date-time
   *                         example: "2024-05-17T00:00:00.000Z"
   *                   message:
   *                     type: string
   *                     example: "Previous work updated!"
   *                   status:
   *                     type: integer
   *                     example: 201
   *         404:
   *           description: Did not find the previous work using the work ID.
   *         500:
   *           description: Internal server error.
   *   /api/tourGuide/deletePreviousWork/{tour_guide_id}/previousWork/{previous_work_id}:
   *     delete:
   *       tags:
   *         - Tour Guide Profile
   *       summary: Deletes previous work
   *       description: Only needs the ids, and it will delete it from the table and remove object id reference to it in the tour guide
   *       parameters:
   *         - name: tour_guide_id
   *           in: path
   *           description: The owner of the previous work to delete.
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *             example: 6700067cce53c3263e1f8e5c
   *         - name: previous_work_id
   *           in: path
   *           description: The previous work we want to delete.
   *           required: true
   *           schema:
   *             type: string
   *             format: objectId
   *             example: 6700dc8780d35b7805f1cfd0
   *       responses:
   *         201:
   *           description: Previous work is deleted
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
   *                       previous_work_id:
   *                         type: string
   *                         example: "6700d80b347ffedb54ee30d2"
   *                       title:
   *                         type: string
   *                         example: "el ektshaf abo el hol"
   *                   message:
   *                     type: string
   *                     example: "Previous work deleted"
   *                   status:
   *                     type: integer
   *                     example: 200
   *         404:
   *           description: Did not find the previous work/tour guide using the work/tour guide ID.
   *         500:
   *           description: Internal server error.
   *   /api/tourGuide/createProfile:
   *     post:
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
   *                 email:
   *                   type: string
   *                 phone_number:
   *                   type: string
   *                 name:
   *                   type: string
   *                 password:
   *                   type: string
   *                 documents_required:
   *                   type: array
   *                   items:
   *                     type: string
   *                 photo:
   *                   type: string
   *       responses:
   *         201:
   *           description: Successful creation of profile
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
   *                       tour_guide_id:
   *                         type: string
   *                         example: "6702481bfe08b9a3f6556ea1"
   *                   message:
   *                     type: string
   *                     example: "Tour guide created"
   *                   status:
   *                     type: integer
   *                     example: 201
   *         500:
   *           description: Internal server error.
   *   /api/tourGuide/getProfile/{email}:
   *     get:
   *       tags:
   *         - Tour Guide Profile
   *       summary: Fetches information about the tour guide's profile
   *       description: This returns everything about the user
   *       parameters:
   *         - name: email
   *           in: path
   *           description: The owner of said profile.
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         201:
   *           description: Successful retrieval of profile
   *         404:
   *           description: Did not find the tour guide in either the tour_guide table or the user table
   *         500:
   *           description: Internal server error.
   *   /api/tourGuide/updateProfile/{email}:
   *     put:
   *       tags:
   *         - Tour Guide Profile
   *       summary: Updates the year and photo of a tour guide.
   *       description: Note that even if the tour guide does not update a field, it should send the old field, otherwise it will be set to be empty. If previous work needs to be updated/created, use their respective apis and not this one
   *       parameters:
   *         - name: email
   *           in: path
   *           description: The email of the tour guide to update.
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
   *                 phone_number:
   *                   type: string
   *                 photo:
   *                   type: string
   *                 years_of_experience:
   *                   type: number
   *       responses:
   *         200:
   *           description: Successful updating of profile
   *         404:
   *           description: Did not find the tour guide in either the tour_guide table or the user table
   *         500:
   *           description: Internal server error.
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
   */
  const tourGuideController: TourGuideController = Container.get(TourGuideController);
  app.use("/tourGuide", router);
  // CRUD for work experience
  router.post("/createPreviousWork", authorize([UserRoles.TourGuide]), tourGuideController.createPreviousWork);
  router.put("/updatePreviousWork", authorize([UserRoles.TourGuide]), tourGuideController.updatePreviousWork);
  router.delete(
    "/deletePreviousWork/:tour_guide_id/previousWork/:previous_work_id",
    authorize([UserRoles.TourGuide]),
    tourGuideController.deletePreviousWork
  );
  // Create, Read and update for profile
  router.post("/createProfile", tourGuideController.createProfile);
  router.get("/getProfile/:email", authorize([UserRoles.TourGuide]), tourGuideController.getProfile);
  router.put("/updateProfile/:email", authorize([UserRoles.TourGuide]), tourGuideController.updateProfile);

  router.delete("/deleteTourGuideAccountRequest/:email", tourGuideController.deleteTourGuideAccountRequest);
};

import { Router } from "express";
import { ActivityController } from "../controllers/activityController";
import Container from "typedi";
const router = Router();

export default (app: Router) => {
  const activityController: ActivityController =
    Container.get(ActivityController);

  app.use("/activity", router);

 /**
   * @swagger
   * tags:
   *   - name: Activity
   *     description: Activity management and retrieval
   *
   * paths:
   *   /api/activity/addActivity:
   *     post:
   *       tags:
   *         - Activity
   *       summary: Add a new activity
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 date:
   *                   type: string
   *                   format: date
   *                 time:
   *                   type: string
   *                   format: time
   *                 location:
   *                   type: object
   *                   properties:
   *                     longitude:
   *                       type: number
   *                     latitude:
   *                       type: number
   *                   description: JSON object with longitude and latitude
   *                 price:
   *                   type: number
   *                 price_range:
   *                   type: string
   *                 category:
   *                   type: string
   *                 tags:
   *                   type: array
   *                   items:
   *                     type: string
   *                 special_discount:
   *                   type: number
   *                 booking_flag:
   *                   type: boolean
   *                 advertiser_id:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Activity created successfully.
   *         '400':
   *           description: Invalid input.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/activity/getAllActivities:
   *     get:
   *       tags:
   *         - Activity
   *       summary: Retrieve all activities
   *       responses:
   *         '200':
   *           description: A list of activities.
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     date:
   *                       type: string
   *                       format: date
   *                     time:
   *                       type: string
   *                       format: time
   *                     location:
   *                       type: object
   *                       properties:
   *                         longitude:
   *                           type: number
   *                         latitude:
   *                           type: number
   *                       description: JSON object with longitude and latitude
   *                     price:
   *                       type: number
   *                     price_range:
   *                       type: string
   *                     category:
   *                       type: string
   *                     tags:
   *                       type: array
   *                       items:
   *                         type: string
   *                     special_discount:
   *                       type: number
   *                     booking_flag:
   *                       type: boolean
   *                     advertiser_id:
   *                       type: string
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/activity/getActivityByID/{id}:
   *     get:
   *       tags:
   *         - Activity
   *       summary: Retrieve an activity by ID
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Activity data.
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   advertiserID:
   *                     type: string
   *                   tags:
   *                     type: array
   *                     items:
   *                       type: string
   *         '404':
   *           description: Activity not found.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/activity/getActivityByAdvertiserID/{advertiserID}:
   *     get:
   *       tags:
   *         - Activity
   *       summary: Retrieve activities by advertiser ID
   *       parameters:
   *         - name: advertiserID
   *           in: path
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: A list of activities.
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     date:
   *                       type: string
   *                       format: date
   *                     time:
   *                       type: string
   *                       format: time
   *                     location:
   *                       type: object
   *                       properties:
   *                         longitude:
   *                           type: number
   *                         latitude:
   *                           type: number
   *                       description: JSON object with longitude and latitude
   *                     price:
   *                       type: number
   *                     price_range:
   *                       type: string
   *                     category:
   *                       type: string
   *                     tags:
   *                       type: array
   *                       items:
   *                         type: string
   *                     special_discount:
   *                       type: number
   *                     booking_flag:
   *                       type: boolean
   *                     advertiser_id:
   *                       type: string
   *         '404':
   *           description: Advertiser not found.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/activity/updateActivity/{id}:
   *     put:
   *       tags:
   *         - Activity
   *       summary: Update an existing activity
   *       parameters:
   *         - name: id
   *           in: path
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
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 date:
   *                   type: string
   *                   format: date
   *                 time:
   *                   type: string
   *                   format: time
   *                 location:
   *                   type: object
   *                   properties:
   *                     longitude:
   *                       type: number
   *                     latitude:
   *                       type: number
   *                   description: JSON object with longitude and latitude
   *                 price:
   *                   type: number
   *                 price_range:
   *                   type: string
   *                 category:
   *                   type: string
   *                 tags:
   *                   type: array
   *                   items:
   *                     type: string
   *                 special_discount:
   *                   type: number
   *                 booking_flag:
   *                   type: boolean
   *                 advertiser_id:
   *                   type: string
   *       responses:
   *         '200':
   *           description: Activity updated successfully.
   *         '400':
   *           description: Invalid input.
   *         '404':
   *           description: Activity not found.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/activity/deleteActivity/{id}:
   *     delete:
   *       tags:
   *         - Activity
   *       summary: Delete an activity by ID
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Activity deleted successfully.
   *         '404':
   *           description: Activity not found.
   *         '500':
   *           description: Internal Server Error.
   * /api/activity/getActivities:
   *   get:
   *     tags:
   *       - Activity
   *     summary: Retrieve activities from system
   *     description: Retrieve activities data by name, category, and tag
   *     parameters:
   *       - in: query
   *         name: name
   *         description: Name of the activity
   *         schema:
   *           type: string
   *       - in: query
   *         name: category
   *         description: Category of the activity
   *         schema:
   *           type: string
   *       - in: query
   *         name: tag
   *         description: Tag of the activity
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of Activities.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/activity/getUpcomingActivities:
   *   get:
   *     tags:
   *       - Activity
   *     summary: Retrieve upcoming activities from system
   *     description: Retrieve upcoming activities data
   *     responses:
   *       200:
   *         description: List of upcoming activities.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   * /api/activity/getFilteredActivities:
   *   get:
   *     tags:
   *       - Activity
   *     summary: Retrieve filtered activities from system
   *     description: Retrieve filtered activities data
   *     parameters:
   *       - in: query
   *         name: budget
   *         description: Budget for the activity
   *         schema:
   *           type: string
   *       - in: query
   *         name: rating
   *         description: Rating of the activity
   *         schema:
   *           type: string
   *       - in: query
   *         name: date
   *         description: Date of the activity
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: category
   *         description: Category of the activity
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of filtered activities.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   */

  router.post("/addActivity", activityController.createActivity);
  router.get("/getAllActivites", activityController.getAllActivities);
  router.get("/getActivityByID/:id", activityController.getActivityByID);
  router.get("/getActivityByAdvertiserID/:advertiserID",activityController.getActivityByAdvertiserID);
  router.put("/updateActivity", activityController.updateActivity);
  router.delete("/deleteActivity/:id", activityController.deleteActivity);
  router.get("/getActivities", activityController.getActivities);
  router.get("/getUpcomingActivities", activityController.getUpcomingActivities);

  router.get("/getFilteredActivities", activityController.getFilteredActivities);


};

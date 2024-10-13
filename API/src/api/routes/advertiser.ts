import { Router } from "express";
import { AdvertiserController } from "../controllers/advertiserController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();

export default (app: Router) => {
  const advertiserController: AdvertiserController =
    Container.get(AdvertiserController);

  app.use("/advertiser", router);

  /**
   * @swagger
   * tags:
   *   - name: Advertiser
   *     description: Advertiser management and retrieval
   * paths:
   *   /api/advertiser/createAdvertiser:
   *     post:
   *       tags:
   *         - Advertiser
   *       summary: Create a new advertiser
   *       description: Create a new advertiser in the database
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                 name:
   *                   type: string
   *                 username:
   *                   type: string
   *                 password:
   *                   type: string
   *                 phone_number:
   *                   type: string
   *                 activities:
   *                   type: array
   *                   items:
   *                     type: string
   *                 documents_required:
   *                   type: array
   *                   items:
   *                     type: string
   *                 link_to_website:
   *                   type: string
   *                 hotline:
   *                   type: string
   *                 about:
   *                   type: string
   *                 logo:
   *                   type: string
   *                 company_profile:
   *                   type: string
   *       responses:
   *         200:
   *           description: Advertiser created.
   *         400:
   *           description: Bad request.
   *         500:
   *           description: Internal server error.
   *   /api/advertiser/getAdvertiserByEmail/{email}:
   *     get:
   *       tags:
   *         - Advertiser
   *       summary: Get advertiser by email
   *       parameters:
   *         - in: path
   *           name: email
   *           schema:
   *             type: string
   *           required: true
   *           description: Email of advertiser
   *       responses:
   *         200:
   *           description: Advertiser found
   *         400:
   *           description: Bad request
   *         500:
   *           description: Internal server error
   *   /api/advertiser/updateAdvertiser/{email}:
   *     put:
   *       tags:
   *         - Advertiser
   *       summary: Update advertiser by email
   *       parameters:
   *         - in: path
   *           name: email
   *           schema:
   *             type: string
   *           required: true
   *           description: Email of advertiser
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 username:
   *                   type: string
   *                 password:
   *                   type: string
   *                 phone_number:
   *                   type: string
   *                 activities:
   *                   type: array
   *                   items:
   *                     type: string
   *                 documents_required:
   *                   type: array
   *                   items:
   *                     type: string
   *                 link_to_website:
   *                   type: string
   *                 hotline:
   *                   type: string
   *                 about:
   *                   type: string
   *                 logo:
   *                   type: string
   *                 company_profile:
   *                   type: string
   *       responses:
   *         200:
   *           description: Advertiser updated
   *         400:
   *           description: Bad request
   *         500:
   *           description: Internal server error
   *   /api/advertiser/deleteAdvertiser/{email}:
   *     delete:
   *       tags:
   *         - Advertiser
   *       summary: Delete advertiser by email
   *       parameters:
   *         - in: path
   *           name: email
   *           schema:
   *             type: string
   *           required: true
   *           description: Email of advertiser
   *       responses:
   *         200:
   *           description: Advertiser deleted
   *         400:
   *           description: Bad request
   *         500:
   *           description: Internal server error
   */
  router.post(
    "/createAdvertiser",
    advertiserController.createAdvertiserController
  );
  router.get(
    "/getAdvertiserByEmail/:email",
    authorize([UserRoles.Advertiser]),
    advertiserController.getAdvertiserByEmailController
  );
  router.get(
    "/getAllAdvertisers",
    advertiserController.getAllAdvertisersController
  );
  router.get(
    "/getAdvertiserByID/:id",
    advertiserController.getAdvertiserByIDController
  );
  router.get(
    "/getAdvertiserByUserID/:userID",
    advertiserController.getAdvertiserByUserIDController
  );
  router.get(
    "/getAdvertiserByActivityID/:activityID",
    advertiserController.getAdvertiserByActivityIDController
  );
  router.put(
    "/updateAdvertiser/:email",
    authorize([UserRoles.Advertiser]),
    advertiserController.updateAdvertiserController
  );
  router.delete(
    "/deleteAdvertiser/:email",
    authorize([UserRoles.Advertiser]),
    advertiserController.deleteAdvertiserController
  );
  router.post(
    "/createAdvertiserMain",
    // authorize([UserRoles.Advertiser]),
    advertiserController.createAdvertiserMainController
  );
};

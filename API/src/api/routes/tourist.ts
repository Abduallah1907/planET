import { Router } from "express";
import Container from "typedi";
import { TouristController } from "../controllers/touristController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const route = Router();

export default (app: Router) => {
  const touristController: TouristController = Container.get(TouristController);

  app.use("/tourist", route);
  /**
   * @swagger
   *
   * components:
   *   schemas:
   *     ITouristCreateDTO:
   *       type: object
   *       properties:
   *         email:
   *           type: string
   *         name:
   *           type: string
   *         username:
   *           type: string
   *         password:
   *           type: string
   *         role:
   *           type: string
   *           enum: [Tourist]
   *         phone_number:
   *           type: string
   *         date_of_birth:
   *           type: string
   *           format: date
   *     ITouristUpdateDTO:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *         newEmail:
   *           type: string
   *         password:
   *           type: string
   *         phone_number:
   *           type: string
   *         job:
   *           type: string
   *         nation:
   *           type: string
   *         addresses:
   *           type: array
   *           items:
   *             type: string
   *     ITourist:
   *       type: object
   *       properties:
   *         email:
   *           type: string
   *         name:
   *           type: string
   *         username:
   *           type: string
   *         password:
   *           type: string
   *         role:
   *           type: string
   *         phone_number:
   *           type: string
   *         date_of_birth:
   *           type: string
   *           format: date
   *     ITouristOutputDTO:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *         username:
   *           type: string
   *         email:
   *           type: string
   *         password:
   *           type: string
   *         role:
   *           type: string
   *         phone_number:
   *           type: string
   *         status:
   *           type: string
   *         date_of_birth:
   *           type: string
   *           format: date
   *         job:
   *           type: string
   *         nation:
   *           type: string
   *         wallet:
   *           type: number
   *         loyality_points:
   *           type: number
   *         badge:
   *           type: string
   *         addresses:
   *           type: array
   *           items:
   *             type: string
   *     ITouristNewUserDTO:
   *       type: object
   *       properties:
   *         user_id:
   *           type: string
   *         job:
   *           type: string
   *         nation:
   *           type: string
   *         date_of_birth:
   *           type: string
   *           format: date
   *
   * tags:
   *   - name: Tourist
   *     description: Tourist management and retrieval
   * /api/tourist/getTourist/{email}:
   *   get:
   *     tags:
   *       - Tourist
   *     summary: Retrieve tourist from system
   *     description: Retrieve data of tourist by email
   *     parameters:
   *       - in: path
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
   *               phone_number:
   *                 type: string
   *                 description: Phone number of the tourist
   *               date_of_birth:
   *                 type: string
   *                 format: date
   *                 description: Date of birth of the tourist
   *               job:
   *                 type: string
   *                 description: Job of the tourist
   *               nation:
   *                 type: string
   *                 description: Nation of the tourist
   *     responses:
   *       200:
   *         description: Tourist created data.
   *       400:
   *         description: Bad request.
   *       500:
   *         description: Internal server error.
   */
  route.get("/getTourist/:email", authorize([UserRoles.Tourist]), touristController.getTourist);
  route.put("/updateTourist/:searchEmail", authorize([UserRoles.Tourist]), touristController.updateTourist);
  route.post("/createTourist", touristController.createTourist);
  route.delete("/deleteTouristAccountRequest/:email", touristController.deleteTouristAccountRequest);
};

/**
 * @swagger
 * tags:
 *   name: HistoricalTag
 *   description: API for managing historical tags
 *
 * definitions:
 *   HistoricalTag:
 *     type: object
 *     required:
 *       - name
 *       - Values
 *     properties:
 *       name:
 *         type: string
 *         description: The name of the historical tag
 *       Values:
 *         type: array
 *         items:
 *           type: string
 *         description: An array of values associated with the historical tag
 *
 * /historical_tag/getAllHistorical_tag:
 *   get:
 *     tags: [HistoricalTag]
 *     summary: Get all historical tags
 *     responses:
 *       200:
 *         description: A list of historical tags
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/HistoricalTag'
 *
 * /historical_tag/createHistorical_tag:
 *   post:
 *     tags: [HistoricalTag]
 *     summary: Create a new historical tag
 *     parameters:
 *       - in: body
 *         name: historicalTag
 *         description: The historical tag to create
 *         schema:
 *           $ref: '#/definitions/HistoricalTag'
 *     responses:
 *       201:
 *         description: The created historical tag
 *         schema:
 *           $ref: '#/definitions/HistoricalTag'
 *
 * /historical_tag/getHistorical_tagByID/{id}:
 *   get:
 *     tags: [HistoricalTag]
 *     summary: Get a historical tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the historical tag
 *     responses:
 *       200:
 *         description: The requested historical tag
 *         schema:
 *           $ref: '#/definitions/HistoricalTag'
 *
 * /historical_tag/updateHistorical_tag/{id}:
 *   put:
 *     tags: [HistoricalTag]
 *     summary: Update a historical tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the historical tag
 *       - in: body
 *         name: historicalTag
 *         description: The historical tag data to update
 *         schema:
 *           $ref: '#/definitions/HistoricalTag'
 *     responses:
 *       200:
 *         description: The updated historical tag
 *         schema:
 *           $ref: '#/definitions/HistoricalTag'
 *
 * /historical_tag/deleteHistorical_tag/{id}:
 *   delete:
 *     tags: [HistoricalTag]
 *     summary: Delete a historical tag by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the historical tag
 *     responses:
 *       204:
 *         description: Historical tag deleted successfully
 */
import { Router } from "express";
import { Historical_tagController } from "../controllers/historical_tagController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();

export default (app: Router) => {
  const historical_tagController: Historical_tagController = Container.get(
    Historical_tagController
  );

  app.use("/historical_tag", router);
  router.get(
    "/getAllHistorical_tag",
    authorize([UserRoles.Governor]),
    historical_tagController.getAllHistorical_tagController
  );
  router.post(
    "/createHistorical_tag",
    authorize([UserRoles.Governor]),
    historical_tagController.createHistorical_tagController
  );
  router.get(
    "/getHistorical_tagByID/:id",
    authorize([UserRoles.Governor]),
    historical_tagController.getHistorical_tagByIDController
  );
  router.put(
    "/updateHistorical_tag/:id",
    authorize([UserRoles.Governor]),
    historical_tagController.updateHistorical_tagController
  );
  router.delete(
    "/deleteHistorical_tag/:id",
    authorize([UserRoles.Governor]),
    historical_tagController.deleteHistorical_tagController
  );
};

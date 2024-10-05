import { Router } from "express";
import { Historical_tagController } from "../controllers/historical_tagController";
import Container from "typedi";
const router = Router();
export default (app: Router) => {
  const historical_tagController: Historical_tagController = Container.get(
    Historical_tagController
  );
  app.use("/historical_tag", router);
  router.get(
    "/getAllHistorical_tag",
    historical_tagController.getAllHistorical_tagController
  );
  router.post(
    "/createHistorical_tag",
    historical_tagController.createHistorical_tagController
  );
  router.get(
    "/getHistorical_tagByID/:id",
    historical_tagController.getHistorical_tagByIDController
  );
  router.put(
    "/updateHistorical_tag/:id",
    historical_tagController.updateHistorical_tagController
  );
  router.delete(
    "/deleteHistorical_tag/:id",
    historical_tagController.deleteHistorical_tagController
  );
};

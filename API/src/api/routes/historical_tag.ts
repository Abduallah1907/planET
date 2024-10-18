import { Router } from "express";
import { Historical_tagController } from "../controllers/historical_tagController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();

export default (app: Router) => {
  const historical_tagController: Historical_tagController = Container.get(Historical_tagController);

  app.use("/historical_tag", router);
  router.get("/getAllHistorical_tag", authorize([UserRoles.Governor]), historical_tagController.getAllHistorical_tagController);
  router.post("/createHistorical_tag", authorize([UserRoles.Governor]), historical_tagController.createHistorical_tagController);
  router.get("/getHistorical_tagByID/:id", authorize([UserRoles.Governor]), historical_tagController.getHistorical_tagByIDController);
  router.put("/updateHistorical_tag/:id", authorize([UserRoles.Governor]), historical_tagController.updateHistorical_tagController);
  router.delete("/deleteHistorical_tag/:id", authorize([UserRoles.Governor]), historical_tagController.deleteHistorical_tagController);
};

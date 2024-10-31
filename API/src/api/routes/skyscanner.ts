import { Router } from "express";
import { ActivityController } from "../controllers/activityController";
import Container from "typedi";
import SkyscannerController from "../controllers/skyscannerController";
const router = Router();

export default (app: Router) => {
  const skyscannerController: SkyscannerController = Container.get(SkyscannerController);
  app.use("/skyscanner", router);

  router.get("/locations", skyscannerController.getLocationsBykeyword);
};

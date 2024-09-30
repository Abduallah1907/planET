import { Router } from "express";
import { ActivityController } from "../controllers/activityController";
import Container from "typedi";
const router = Router();

export default (app: Router) => {
  const activityController: ActivityController =
    Container.get(ActivityController);

  app.use("/activity", router);

  router.post("/addActivity", activityController.createActivity);
  router.get("/allActivites", activityController.getAllActivities);
  router.get("/ActivityByID", activityController.getActivityByID);
  router.get(
    "/ActivityByAdvisorID",
    activityController.getActivityByAdvisor_ID
  );
  router.put("/updateActivity", activityController.updateActivity);
  router.delete("/deleteActivity", activityController.deleteActivity);
};

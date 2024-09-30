import { Router } from "express";
import {
  ActivityController,
  // createActivity,
  // deleteActivity,
  // getActivityByAdvisor_ID,
  // getActivityByID,
  // updateActivity,
} from "../controllers/activityController";
const router = Router();

export default (app: Router) => {
  app.use("/activity", router);

  // router.post("/addActivity", createActivity);
  router.get("/allActivites", ActivityController.getAllActivities);
  // router.get("/ActivityByID", getActivityByID);
  // router.get("/ActivityByAdvisorID", getActivityByAdvisor_ID);
  //router.put("/updateActivity", updateActivity);
  // router.delete("/deleteActivity", deleteActivity);
};

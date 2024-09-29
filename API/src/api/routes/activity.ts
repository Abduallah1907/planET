import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivityByAdvisor_ID,
  getActivityByID,
  getAllActivities,
  updateActivity,
} from "../controllers/Activity_Con";
const router = Router();

export default (app: Router) => {
  app.use("/activity", router);

  router.post("/addActivity", createActivity);
  router.get("/allActivites", getAllActivities);
  router.get("/ActivityByID", getActivityByID);
  router.get("/ActivityByAdvisorID", getActivityByAdvisor_ID);
  router.put("/updateActivity", updateActivity);
  router.delete("/deleteActivity", deleteActivity);
};

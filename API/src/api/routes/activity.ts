import { Router } from "express";
import { ActivityController } from "../controllers/activityController";
import express from "express";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const router = Router();

export default (app: Router) => {
  const activityController: ActivityController = Container.get(ActivityController);
  app.use("/activity", router);

  router.post("/addActivity", authorize([UserRoles.Advertiser]), activityController.createActivity);
  router.get("/getAllActivities", activityController.getAllActivities);

  router.get("/getActivityByID/:id", activityController.getActivityByID);

  router.get("/getActivitiesByAdvertiserID/:advertiserID", authorize([UserRoles.Advertiser]), activityController.getActivitiesByAdvertiserID);

  router.put("/updateActivity/:id", authorize([UserRoles.Advertiser]), activityController.updateActivity);

  router.delete("/deleteActivity/:id", authorize([UserRoles.Advertiser]), activityController.deleteActivity);

  router.get("/getSearchActivity", authorize([UserRoles.Tourist]), activityController.getSearchActivity);
  router.get("/getUpcomingActivities", activityController.getUpcomingActivities);

  router.get("/getFilteredActivities", activityController.getFilteredActivities);
  router.get("/getSortedActivities", activityController.getSortedActivities);
  router.get("/getFilterComponents", activityController.getFilterComponents);
};

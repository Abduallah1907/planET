import { Router } from "express";
import { ActivityController } from "../controllers/activityController";
import express from "express";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
import getRoleAndID from "../middlewares/getRole";
const router = Router();

export default (app: Router) => {
  const activityController: ActivityController =
    Container.get(ActivityController);
  app.use("/activity", router);

  router.post(
    "/addActivity",
    authorize([UserRoles.Advertiser]),
    activityController.createActivity
  );
  router.get(
    "/getAllActivities",
    getRoleAndID,
    activityController.getAllActivities
  );

  router.get("/getActivityByID/:id", activityController.getActivityByID);

  router.get(
    "/getActivitiesByAdvertiserID/:advertiserID",
    authorize([UserRoles.Advertiser]),
    activityController.getActivitiesByAdvertiserID
  );

  router.put(
    "/updateActivity/:id",
    authorize([UserRoles.Advertiser]),
    activityController.updateActivity
  );

  router.delete(
    "/deleteActivity/:id",
    authorize([UserRoles.Advertiser]),
    activityController.deleteActivity
  );

  router.get(
    "/getSearchActivity",
    getRoleAndID,
    authorize([UserRoles.Tourist, UserRoles.Admin]),
    activityController.getSearchActivity
  );
  router.get(
    "/getUpcomingActivities",
    getRoleAndID,
    activityController.getUpcomingActivities
  );

  router.get(
    "/getFilteredActivities",
    getRoleAndID,
    activityController.getFilteredActivities
  );
  router.get(
    "/getSortedActivities",
    getRoleAndID,
    activityController.getSortedActivities
  );
  router.get(
    "/getFilterComponents",
    getRoleAndID,
    activityController.getFilterComponents
  );

  // should be done by admin only
  router.put("/flagActivity/:activity_id", activityController.flagActivity);

  router.get("/getComments/:activity_id", activityController.getComments);
};

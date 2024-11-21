import { Router } from "express";
import NotificationController from "../controllers/notificationController";
import express from "express";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
import getRoleAndID from "../middlewares/getRole";
import exp from "constants";
import UserType from "@/types/enums/userTypesNotified";
const router = Router();
export default (app: Router) => {
  const notificationController: NotificationController = Container.get(
    NotificationController
  );
  app.use("/notification", router);

  router.get(
    "/getNotificationsByEmail/:email",
    authorize(Object.values(UserType)),
    notificationController.getNotificationsById
  );
  router.get(
    "/getNotificationNumber/:id",
    authorize(Object.values(UserType)),
    notificationController.getNotificationNumber
  );
};

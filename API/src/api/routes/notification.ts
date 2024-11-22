import { Router } from "express";
import NotificationController from "../controllers/notificationController";
import express from "express";
import Container from "typedi";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";

const router = Router();
export default (app: Router) => {
  const notificationController: NotificationController = Container.get(
    NotificationController
  );
  app.use("/notification", router);

  router.get(
    "/getNotificationsByEmail/:email",
    authorize(Object.values(UserRoles)),
    notificationController.getNotificationsByEmail
  );
  router.get(
    "/getNotificationNumber/:email",
    authorize(Object.values(UserRoles)),
    notificationController.getNotificationNumber
  );
};

import Container, { Service } from "typedi";
import { Request, Response } from "express";
import NotificationService from "@/services/notificationService";
import { Types } from "mongoose";

@Service()
export default class NotificationController {
  //Get all notifications using id
  public async getNotificationsById(req: any, res: any) {
    const { id } = req.params;
    const notificationService: NotificationService =
      Container.get(NotificationService);
    const notifications = await notificationService.getNotificationsByIdService(
      id
    );
    res.status(notifications.status).json(notifications);
  }
  //Get notication number
  public async getNotificationNumber(req: any, res: any) {
    const { id } = req.params;
    const notificationService: NotificationService =
      Container.get(NotificationService);
    const notifications =
      await notificationService.getNotificationNumberService(id);
    res.status(notifications.status).json(notifications);
  }
}

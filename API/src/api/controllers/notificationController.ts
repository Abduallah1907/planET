import Container, { Service } from "typedi";
import { Request, Response } from "express";
import NotificationService from "@/services/notificationService";
import { Types } from "mongoose";

@Service()
export default class NotificationController {
  //Create notification
  public async createNotification(req: any, res: any) {
    const notificationService: NotificationService =
      Container.get(NotificationService);
    const notificationData = req.body;
    const notification = await notificationService.createNotificationService(
      notificationData.notified_id,
      notificationData.message,
      notificationData.user_type
    );
    res.status(notification.status).json(notification);
  }

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

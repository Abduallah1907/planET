import Container, { Service } from "typedi";
import NotificationService from "@/services/notificationService";

@Service()
export default class NotificationController {
  //Get all notifications using id
  public async getNotificationsByEmail(req: any, res: any) {
    const { email } = req.params;
    const notificationService: NotificationService =
      Container.get(NotificationService);
    const notifications =
      await notificationService.getNotificationsByEmailService(email);
    res.status(notifications.status).json(notifications);
  }
  //Get notication number
  public async getNotificationNumber(req: any, res: any) {
    const { email } = req.params;
    const notificationService: NotificationService =
      Container.get(NotificationService);
    const notifications =
      await notificationService.getNotificationNumberService(email);
    res.status(notifications.status).json(notifications);
  }
}

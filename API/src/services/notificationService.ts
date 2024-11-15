import { INotification } from "@/interfaces/INotification";
import UserType from "@/types/enums/userTypesNotified";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import response from "@/types/responses/response";
import Container, { Inject, Service } from "typedi";
import mongoose, { Types } from "mongoose";
import Notification from "@/models/Notification";
import { ObjectId } from "mongodb";
import MailerService from "@/services/mailer";

@Service()
export default class NotificationService {
  constructor(
    @Inject("notificationModel")
    private notificationModel: Models.NotificationModel
  ) {}
  //create notification
  public async createNotificationService(
    notified_id: ObjectId,
    message: string,
    user_type: string
  ) {
    if (!Types.ObjectId.isValid(notified_id)) {
      throw new BadRequestError("Invalid Id");
    }
    if (!Object.values(UserType).includes(user_type as UserType)) {
      throw new BadRequestError("Invalid user type");
    }
    const notification = new this.notificationModel({
      notified_id,
      message,
      user_type,
      read_flag: false,
    });
    if (notification instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (notification == null) {
      throw new NotFoundError("Failed to create notification");
    }
    const notificationSave = await notification.save();
    if (notificationSave instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (notificationSave == null) {
      throw new NotFoundError("Failed to create notification");
    }
    return new response(
      true,
      notificationSave,
      "Notification created successfully",
      201
    );
  }
  //get all notifications using id and read all notifications
  public async getNotificationsByIdService(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid Id");
    }
    const notifications = await this.notificationModel.find({
      notified_id: id,
    });
    if (notifications instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (notifications == null) {
      throw new NotFoundError("No notifications found");
    }
    //make all the notifications read
    const readNotifications = await this.notificationModel.updateMany(
      { notified_id: id },
      { read_flag: true }
    );
    if (readNotifications instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (readNotifications == null) {
      throw new NotFoundError("Failed to read notifications");
    }
    //sort notifications by read_flag and then created date
    notifications.sort((a: INotification, b: INotification) => {
      if (a.read_flag === b.read_flag) {
        return (a.createdAt ?? 0) > (b.createdAt ?? 0) ? -1 : 1;
      }
      return a.read_flag > b.read_flag ? 1 : -1;
    });
    return new response(true, notifications, "Notifications found", 200);
  }
  //get notification number
  public async getNotificationNumberService(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid Id");
    }
    const notifications = await this.notificationModel.find({
      notified_id: id,
      read_flag: false,
    });
    if (notifications instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (notifications == null) {
      throw new NotFoundError("No notifications found");
    }
    return new response(true, notifications.length, "Notifications found", 200);
  }
  //send email notification
  public async sendEmailNotificationService(
    Title: string,
    email: string,
    message: string
  ) {
    const mailerServiceInstance = Container.get(MailerService);
    //send email notification
    // this.createNotificationService(notified_id, message, user_type);
    //send email
    mailerServiceInstance.sendEmailNotification(Title, email, message);
    //return response
    return new response(true, null, "Email sent", 200);
  }
}

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
import admin from "@/api/routes/admin";

@Service()
export default class NotificationService {
  constructor(
    @Inject("notificationModel")
    private notificationModel: Models.NotificationModel,
    @Inject("userModel")
    private userModel: Models.UserModel,
    @Inject("advertiserModel")
    private advertiserModel: Models.AdvertiserModel,
    @Inject("sellerModel")
    private sellerModel: Models.SellerModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("touristModel") private touristModel: Models.TouristModel
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
  public async getNotificationsByEmailService(email: string) {
    //get user id
    const user = await this.userModel.findOne({ email: email });
    if (user instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (user == null) {
      throw new NotFoundError("User not found");
    }
    let id: string;
    let user_type: string;
    //get notified id
    switch (user.role) {
      case "ADMIN":
        id = user._id as unknown as string;
        user_type = UserType.Admin;
        break;
      case "ADVERTISER":
        //get advertiser id
        const advertiser = await this.advertiserModel.findOne({
          user_id: user._id,
        });
        if (advertiser instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (advertiser == null) {
          throw new NotFoundError("Advertiser not found");
        }
        id = advertiser._id as unknown as string;
        user_type = UserType.Advertiser;
        break;
      case "SELLER":
        const seller = await this.sellerModel.findOne({
          user_id: user._id,
        });

        if (seller instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (seller == null) {
          throw new NotFoundError("Governor not found");
        }
        id = seller._id as unknown as string;
        user_type = UserType.Seller;
        break;
      case "TOUR_GUIDE":
        const tourGuide = await this.tourGuideModel.findOne({
          user_id: user._id,
        });
        if (tourGuide instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (tourGuide == null) {
          throw new NotFoundError("Tour Guide not found");
        }
        id = tourGuide._id as unknown as string;
        user_type = UserType.TourGuide;
        break;
      case "TOURIST":
        const tourist = await this.touristModel.findOne({
          user_id: user._id,
        });
        if (tourist instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (tourist == null) {
          throw new NotFoundError("Tourist not found");
        }
        id = tourist._id as unknown as string;
        user_type = UserType.Tourist;
        break;
      default:
        throw new BadRequestError("Invalid user type");
    }

    const notifications = await this.notificationModel.find({
      notified_id: new Types.ObjectId(id),
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
  public async getNotificationNumberService(email: string) {
    //get user id
    const user = await this.userModel.findOne({ email: email });
    if (user instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (user == null) {
      throw new NotFoundError("User not found");
    }
    let id: string;
    let user_type: string;
    //get notified id
    switch (user.role) {
      case "ADMIN":
        id = user._id as unknown as string;
        user_type = UserType.Admin;
        break;
      case "ADVERTISER":
        //get advertiser id
        const advertiser = await this.advertiserModel.findOne({
          user_id: user._id,
        });
        if (advertiser instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (advertiser == null) {
          throw new NotFoundError("Advertiser not found");
        }
        id = advertiser._id as unknown as string;
        user_type = UserType.Advertiser;
        break;
      case "SELLER":
        const seller = await this.sellerModel.findOne({
          user_id: user._id,
        });

        if (seller instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (seller == null) {
          throw new NotFoundError("Governor not found");
        }
        id = seller._id as unknown as string;
        user_type = UserType.Seller;
        break;
      case "TOUR_GUIDE":
        const tourGuide = await this.tourGuideModel.findOne({
          user_id: user._id,
        });
        if (tourGuide instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (tourGuide == null) {
          throw new NotFoundError("Tour Guide not found");
        }
        id = tourGuide._id as unknown as string;
        user_type = UserType.TourGuide;
        break;
      case "TOURIST":
        const tourist = await this.touristModel.findOne({
          user_id: user._id,
        });
        if (tourist instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (tourist == null) {
          throw new NotFoundError("Tourist not found");
        }
        id = tourist._id as unknown as string;
        user_type = UserType.Tourist;
        break;
      default:
        throw new BadRequestError("Invalid user type");
    }

    const notifications = await this.notificationModel.find({
      notified_id: new Types.ObjectId(id),
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

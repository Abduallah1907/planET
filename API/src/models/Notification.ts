import { INotification } from "@/interfaces/INotification";
import UserRoles from "@/types/enums/userRoles";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notified_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read_flag: {
      type: Boolean,
      required: true,
    },
    user_type: {
      type: String,
      enum: Object.values(UserRoles),
      required: true,
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model<INotification & mongoose.Document>(
  "Notification",
  notificationSchema
);
export default Notification;

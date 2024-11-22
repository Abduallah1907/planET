import { INotification } from "@/interfaces/INotification";
<<<<<<< HEAD
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    type: {
        type: String,
        required: true,
    },
});

const Notification = mongoose.model<INotification & mongoose.Document>("Notification", NotificationSchema);

export default Notification;
=======
import UserType from "@/types/enums/userTypesNotified";
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
      enum: Object.values(UserType),
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
>>>>>>> origin/backend

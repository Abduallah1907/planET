import { INotification } from "@/interfaces/INotification";
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
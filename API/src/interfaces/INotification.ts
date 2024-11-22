import mongoose from "mongoose";

export interface INotification {
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    type: string;
}
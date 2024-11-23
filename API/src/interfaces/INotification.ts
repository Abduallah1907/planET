import UserType from "@/types/enums/userTypesNotified";
import mongoose, { Document } from "mongoose";

type ObjectId = mongoose.Schema.Types.ObjectId;

export interface INotification extends Document {
  notified_id: ObjectId;
  message: string;
  read_flag: boolean;
  user_type: UserType;
  createdAt?: Date;
  updatedAt?: Date;
}

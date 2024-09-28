import { Document, ObjectId } from 'mongoose';

export interface IBookmark_Notify extends Document {
  bookmark_notify_id: ObjectId;
  activity_id: ObjectId;
  user_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

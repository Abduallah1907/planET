import { Document, ObjectId } from 'mongoose';

export interface IBookmark_notify extends Document {
  activity_id: ObjectId;
  user_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

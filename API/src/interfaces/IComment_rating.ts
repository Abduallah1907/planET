import { Document, ObjectId } from 'mongoose';

export interface IComment_Rating extends Document {
  user_id: ObjectId;
  comment: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Document, ObjectId } from 'mongoose';

export interface IComment_Rating extends Document {
  comment_rating_id: ObjectId;
  user_id: ObjectId;
  comment: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

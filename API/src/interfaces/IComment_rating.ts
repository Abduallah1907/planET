import { Document, ObjectId } from "mongoose";

export interface IComment_Rating extends Document {
  tourist_id: ObjectId;
  comment: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

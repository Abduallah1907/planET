import { Document, ObjectId } from "mongoose";

export interface ITag extends Document {
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

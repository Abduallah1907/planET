import { Document, ObjectId } from "mongoose";

export interface IWishlist extends Document {
  tourist_id: ObjectId;
  products: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

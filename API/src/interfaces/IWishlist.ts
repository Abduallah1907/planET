import { Document, ObjectId } from 'mongoose';

export interface IWishlist extends Document {
  wishlist_id: ObjectId;
  user_id: number;
  products: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

import { Document, ObjectId } from 'mongoose';

export interface IWishlist extends Document {
  
  user_id: number;
  products: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

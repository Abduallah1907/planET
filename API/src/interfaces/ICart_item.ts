import { Document, ObjectId } from 'mongoose';

export interface ICart_item extends Document {
  cart_item_id: ObjectId;
  product_id: ObjectId;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

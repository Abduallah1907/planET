import { Document, ObjectId } from 'mongoose';

export interface ICart_item extends Document {
  product_id: ObjectId;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

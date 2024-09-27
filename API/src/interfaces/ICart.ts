import { Document, ObjectId } from 'mongoose';

export interface ICart extends Document {
  cart_id: ObjectId;
  items: ObjectId[];
  cost: number;
  createdAt?: Date;
  updatedAt?: Date;
}

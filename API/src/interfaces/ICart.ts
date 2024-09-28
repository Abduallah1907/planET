import { Document, ObjectId } from 'mongoose';

export interface ICart extends Document {
  items: ObjectId[];
  cost: number;
  createdAt?: Date;
  updatedAt?: Date;
}

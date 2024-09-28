import { Document, ObjectId } from 'mongoose';

export interface IOrder extends Document {
  user_id: ObjectId;
  products: ObjectId[];
  date: Date;
  cost: number;
  status: 'pending' | 'cancelled' | 'delivered';
  payment_type: 'credit card' | 'cash';
  createdAt?: Date;
  updatedAt?: Date;
}

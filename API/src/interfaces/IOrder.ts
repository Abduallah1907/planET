import OrderStatus from '@/types/enums/orderStatus';
import PaymentType from '@/types/enums/paymentType';
import { Document, ObjectId } from 'mongoose';

export interface IOrder extends Document {
  user_id: ObjectId;
  products: ObjectId[];
  date: Date;
  cost: number;
  status: OrderStatus;
  payment_type: PaymentType;
  createdAt?: Date;
  updatedAt?: Date;
}

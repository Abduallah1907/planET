import { Document, ObjectId } from 'mongoose';

export interface IPromo_code extends Document {
  promo_code_id: ObjectId;
  code: string;
  expiry_date: Date;
  discount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
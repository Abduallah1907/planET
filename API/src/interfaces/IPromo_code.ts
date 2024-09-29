import { Document, ObjectId } from 'mongoose';


export interface IPromo_Code extends Document {
  code: string;
  expiry_date: Date;
  discount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
import { Document, ObjectId } from 'mongoose';

export interface IProduct extends Document {

  user_id: ObjectId;
  comments: ObjectId[];
  name: string;
  description: string;
  picture: string;
  price: number;
  quantity: number;
  sales: number;
  archieve_flag: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

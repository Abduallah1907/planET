import { Document,ObjectId } from 'mongoose';

export interface IActivity extends Document {
  activity_id: ObjectId;
  category: ObjectId;
  comments: ObjectId[];
  name: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
  inappropriate_flag: boolean;
  active_flag: boolean;
  adverstier_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

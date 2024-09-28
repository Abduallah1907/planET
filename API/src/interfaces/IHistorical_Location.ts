import { Document, ObjectId } from 'mongoose';

export interface IHistorical_Location extends Document {
  historical_location_id: ObjectId;
  governor_id: ObjectId;
  comments: ObjectId[];
  name: string;
  description: string;
  picture: string[];
  location: string;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
  native_price: number;
  foreign_price: number;
  student_price: number;
  active_flag: boolean;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

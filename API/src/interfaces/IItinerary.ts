import { Document, ObjectId } from 'mongoose';

export interface IItinerary extends Document {
  activities: ObjectId[];
  timeline: ObjectId[];
  comments: ObjectId[];
  locations: string[];
  duration: string;
  languages: string[];
  price: number;
  available_dates: Date[];
  accessibility: boolean;
  pickup_loc: string;
  drop_off_loc: string;
  tags?: string[];
  active_flag: boolean;
  inappropriate_flag: boolean;
  tour_guide_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

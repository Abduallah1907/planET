import { Document, ObjectId } from 'mongoose';

export interface IItinerary extends Document {
  itinerary_id: ObjectId;
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
  createdAt?: Date;
  updatedAt?: Date;
}

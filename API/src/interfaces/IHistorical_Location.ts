import { Location } from "@/types/Location";
import mongoose, { Document, mongo, ObjectId } from "mongoose";
import { IHistorical_tag } from "./IHistorical_tag";
export interface IHistorical_location extends Document {
  governor_id: ObjectId;
  comments: ObjectId[];
  name: string;
  description: string;
  images?: mongoose.Schema.Types.ObjectId[];
  location: Location;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
  native_price: number;
  foreign_price: number;
  student_price: number;
  active_flag: boolean;
  tags?: Map<string, string>;
  average_rating: Number;
  date_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  category?: ObjectId;
}
export interface IHistorical_locationDTO {
  name: string;
  governor_id: ObjectId;
  description: string;
  images?: mongoose.Schema.Types.ObjectId[];
  location: Location;
  opening_days?: string[];
  opening_hours_from: string;
  opening_hours_to: string;
  native_price: number;
  foreign_price: number;
  student_price: number;
  tags?: Map<string, string>;
  average_rating?: Number;
  active_flag?: boolean;
  category?: ObjectId;
}

export interface Update_IHistorical_locationDTO {
  name?: string;
  description?: string;
  images?: mongoose.Schema.Types.ObjectId[];
  location?: Location;
  opening_days?: string[];
  opening_hours_from?: string;
  opening_hours_to?: string;
  native_price?: number;
  foreign_price?: number;
  student_price?: number;
  tags?: Map<string, string>;
  active_flag: boolean;
  category?: ObjectId;
}
export interface IHistorical_locationOutputDTO {
  name: string;
  location: Location;
  ratingVal: Number;
  reviews: string[];
  price?: number;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
  description: string;
  isActive: boolean;
  images?: mongoose.Schema.Types.ObjectId[];
  tags?: Map<string, string>;
  category?: ObjectId;
}

import { Location } from "@/types/Location";
import mongoose, { Document } from "mongoose";

type ObjectId = mongoose.Schema.Types.ObjectId;

export interface IActivity extends Document {
  category: ObjectId;
  comments: ObjectId[];
  name: string;
  date: Date;
  time: string;
  location: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional) check the users story 21 in azure
    min: number;
    max: number;
  };
  special_discount?: number;
  tags?: ObjectId[];
  booking_flag: boolean;
  inappropriate_flag: boolean;
  active_flag: boolean;
  average_rating: number;
  advertiser_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IActivityDTO {
  name: string;
  date: Date;
  time: string;
  location: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional)
    min: number;
    max: number;
  };
  category: ObjectId;
  special_discount?: number;
  tags?: ObjectId[];
  booking_flag: boolean;
  active_flag: boolean;
  advertiser_id: ObjectId;
}
export interface UpdateIActivityDTO {
  name?: string;
  date?: Date;
  time?: string;
  location?: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional)
    min?: number;
    max?: number;
  };
  category?: ObjectId;
  special_discount?: number;
  tags?: ObjectId[];
  active_flag?: boolean;
}

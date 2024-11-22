import { Location } from "@/types/Location";
import mongoose, { Document, ObjectId } from "mongoose";

export interface IBookmark_Notify extends Document {
  activity_id: ObjectId;
  tourist_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookmarkActivity extends Document {
  category?: ObjectId;
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
  image?: mongoose.Schema.Types.ObjectId;
  advertiser_id?: ObjectId;
}

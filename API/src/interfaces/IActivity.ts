import { Document, ObjectId } from "mongoose";

export interface IActivity extends Document {
  activity_id: ObjectId;
  category: ObjectId;
  comment: ObjectId[];
  name: string;
  date: Date;
  time: string;
  location: string;
  price?: number; // Single price (optional)
  priceRange?: {
    // Price range (optional) check the users story 21 in azure
    min: number;
    max: number;
  };
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
  inappropriate_flag: boolean;
  active_flag: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IACtivityDTO {
  date: Date;
  time: string;
  location: string;
  price?: number; // Single price (optional)
  priceRange?: {
    // Price range (optional)
    min: number;
    max: number;
  };
  category: ObjectId;
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
}

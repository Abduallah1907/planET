import { historical_tag } from "@/types/Historical_tags";
import { Location } from "@/types/Location";
import { Document, ObjectId } from "mongoose";

export interface IHistorical_location extends Document {
  governor_id: ObjectId;
  comments: ObjectId[];
  name: string;
  description: string;
  picture: string[];
  location: Location;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
  native_price: number;
  foreign_price: number;
  student_price: number;
  active_flag: boolean;
  tags?: historical_tag;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IHistorical_locationDTO {
  name: string;
  governor_id: ObjectId;

  description: string;

  picture: string[];

  location: Location;

  opening_hours_from: string;

  opening_hours_to: string;

  native_price: number;

  foreign_price: number;

  student_price: number;

  tags?: historical_tag;
}

export interface Update_IHistorical_locationDTO {
  name?: string;

  description?: string;

  picture?: string[];

  location?: Location;

  opening_hours_from?: string;

  opening_hours_to?: string;

  native_price?: number;

  foreign_price?: number;

  student_price?: number;
  tags?: historical_tag;
}

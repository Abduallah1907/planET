import { Location } from "@/types/Location";
import { Document, ObjectId } from "mongoose";
import { IHistorical_tag } from "./IHistorical_tag";
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
  tags?: Map<string, string>;
  tags?: ObjectId[];
  date_time?: Date;
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

  tags?: Map<string, string>;
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
  tags?: Map<string, string>;
}

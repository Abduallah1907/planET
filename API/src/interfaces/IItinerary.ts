import { Location } from "@/types/Location";
import mongoose, { Document } from "mongoose";
import { ISlot } from "./ISlot";

type ObjectId = mongoose.Schema.Types.ObjectId;

export interface IItinerary extends Document {
  activities: ObjectId[];
  timeline: ObjectId[];
  comments: ObjectId[];
  locations: Location[];
  duration: string;
  languages: string[];
  price: number;
  available_dates: Date[];
  accessibility: boolean;
  pickup_loc: Location;
  drop_off_loc: Location;
  tags?: ObjectId[];
  active_flag: boolean;
  inappropriate_flag: boolean;
  tour_guide_id: ObjectId;
  name: string;
  image?: mongoose.Schema.Types.ObjectId;
  category?: ObjectId;
  average_rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItineraryCreateDTO {
  tour_guide_id: ObjectId;
  name: string;
  category?: ObjectId;
  activities: ObjectId[];
  slots: ISlot[];
  locations: Location[];
  duration: string;
  languages: string[];
  price: number;
  available_dates: Date[];
  accessibility: boolean;
  pickup_loc: Location;
  drop_off_loc: Location;
  image?: mongoose.Schema.Types.ObjectId;
  tags?: ObjectId[];
  active_flag: boolean;
}

export interface IItineraryUpdateDTO {
  name?: string;
  category?: ObjectId;
  activities?: ObjectId[];
  slots?: ISlot[];
  locations?: Location[];
  duration?: string;
  languages?: string[];
  price?: number;
  available_dates?: Date[];
  accessibility?: boolean;
  pickup_loc?: Location;
  drop_off_loc?: Location;
  image?: mongoose.Schema.Types.ObjectId;
  tags?: ObjectId[];
  active_flag: boolean;
}

export interface IItineraryOutputDTO {
  _id: ObjectId;
  name: string;
  locations?: Location[];
  pickup_loc: Location;
  drop_off_loc: Location;
  languages: String[];
  accessibility: Boolean;
  rating_value: Number;
  reviews: ObjectId[];
  price: Number;
  duration: String;
  available_dates: Date[];
  inappropriate_flag: Boolean;
  image?: mongoose.Schema.Types.ObjectId;
  active_flag: Boolean;
  tags?: ObjectId[];
  timeline: any;
}

export interface IItineraryOutputAllDTO {
  _id: ObjectId;
  name: string;
  locations?: Location[];
  pickup_loc: Location;
  drop_off_loc: Location;
  languages: String[];
  accessibility: Boolean;
  average_rating: Number;
  reviews: ObjectId[];
  price: Number;
  duration: String;
  available_dates: Date[];
  inappropriate_flag: Boolean;
  image?: mongoose.Schema.Types.ObjectId;
  active_flag: Boolean;
  reviews_count: Number;
  tags?: ObjectId[];
}

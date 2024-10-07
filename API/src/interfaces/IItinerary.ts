import { Location } from "@/types/Location";
import { Document, ObjectId } from "mongoose";

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
  category: ObjectId;
  average_rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItineraryCreateDTO {
  tour_guide_id: ObjectId;
  name: string;
  category: ObjectId;
  activities: ObjectId[];
  timeline: ObjectId[];
  locations: Location[];
  duration: string;
  languages: string[];
  price: number;
  available_dates: Date[];
  accessibility: boolean;
  pickup_loc: Location;
  drop_off_loc: Location;
  tags?: ObjectId[];
}

export interface IItineraryUpdateDTO {
  name?: string;
  category?: ObjectId;
  activities?: ObjectId[];
  timeline?: ObjectId[];
  locations?: Location[];
  duration?: string;
  languages?: string[];
  price?: number;
  available_dates?: Date[];
  accessibility?: boolean;
  pickup_loc?: Location;
  drop_off_loc?: Location;
  tags?: ObjectId[];
}

export interface IItineraryOutputDTO {
  itinerary_id: ObjectId;
  activities: ObjectId[];
  timeline: ObjectId[];
  comments: ObjectId[];
  category: ObjectId;
  name: String;
  locations: Location[];
  languages: string[];
  available_dates: Date[];
  pickup_loc: Location;
  drop_off_loc: Location;
  tags?: ObjectId[];
  tour_guide_id: ObjectId;
}

export interface IItineraryOutputAllDTO {
  itinerary_id: ObjectId;
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
  active_flag: Boolean;

  tags?: ObjectId[];
}

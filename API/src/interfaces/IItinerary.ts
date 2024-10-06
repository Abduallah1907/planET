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
  tags?: string[];
  active_flag: boolean;
  inappropriate_flag: boolean;
  tour_guide_id: ObjectId;
  name: string;
  category: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItineraryCreateDTO {
  tour_guide_user_id: ObjectId;
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
  tags?: string[];
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
  tags?: string[];
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
  tags?: string[];
  tour_guide_id: ObjectId;
}

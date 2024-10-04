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
  pickup_loc: string;
  drop_off_loc: string;
  tags?: string[];
  active_flag: boolean;
  inappropriate_flag: boolean;
  tour_guide_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItineraryCreateDTO extends Document {
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
  pickup_loc: string;
  drop_off_loc: string;
  tags?: string[];
}

export interface IItineraryUpdateDTO extends Document {
  itinerary_id: ObjectId;
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
  pickup_loc: string;
  drop_off_loc: string;
  tags?: string[];
}

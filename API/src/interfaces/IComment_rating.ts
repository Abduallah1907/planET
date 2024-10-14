import { Document, ObjectId } from "mongoose";

export interface IComment_Rating extends Document {
  tourist_id: ObjectId;
  comment: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IComment_RatingCreateDTOfortourGuide {
  tour_guide_email: string;
  comment?: string;
  rating?: number;
}
export interface IComment_RatingCreateDTOforItinerary {
  tour_guide_email: string;
  comment?: string;
  rating?: number;
  name_of_itinerary: string;
}
export interface IComment_RatingCreateDTOforActivity {
  name_of_activity: string;
  comment?: string;
  rating?: number;
}

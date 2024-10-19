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
  itinerary_id: string;
  comment?: string;
  rating?: number;
}
export interface IComment_RatingCreateDTOforActivity {
  activity_id: string;
  comment?: string;
  rating?: number;
}
export interface IComment_RatingCreateDTOforProduct {
  product_id: string;
  comment?: string;
  rating?: number;
}

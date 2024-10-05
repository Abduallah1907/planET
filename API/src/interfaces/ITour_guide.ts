import { Document, ObjectId } from "mongoose";

export interface ITour_Guide extends Document {
  user_id: ObjectId;
  itineraries: ObjectId[];
  comments: ObjectId[];
  years_of_experience?: number;
  previous_work_description: ObjectId[];
  documents_required: string[];
  photo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITourGuideOutput {
  itineraries: ObjectId[];
  comments: ObjectId[];
  years_of_experience?: number;
  previous_work_description: ObjectId[];
  photo: string;
  // the attributes below must be taken from user
  username: string;
  name: string;
}

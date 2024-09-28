import { Document, ObjectId } from 'mongoose';

export interface ITour_Guide extends Document {
  tour_guide_id: ObjectId;
  user_id: ObjectId;
  itineraries: ObjectId[];
  comments: ObjectId[];
  years_of_experience?: number;
  previous_work_description: ObjectId[];
  documents_required: string[];
  photo: string;
  approval: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

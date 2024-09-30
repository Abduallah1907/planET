import { Document, ObjectId } from "mongoose";

export interface IAdvertiser extends Document {
  user_id: ObjectId;
  activities: ObjectId[];
  documents_required: string[];
  link_to_website: string;
  hotline: string;
  about: string;
  logo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

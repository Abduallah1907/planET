import { Document, ObjectId } from "mongoose";

export interface IAdvertiser extends Document {
  advertiser_id: ObjectId;
  user_id: ObjectId;
  activities: ObjectId[];
  documents_required: string[];
  link_to_website: string;
  hotline: string;
  about: string;
  logo: string;
  approval: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

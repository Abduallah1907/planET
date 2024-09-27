import { Document, ObjectId } from 'mongoose';

export interface IAdvertisor extends Document {
  advertisor_id: ObjectId;
  user_id: ObjectId;
  activities: ObjectId[];
  documents_required: string[];
  link_to_website: string;
  hotline: string;
  About: string;
  logo: string;
  approval: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

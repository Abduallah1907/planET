import { Document, ObjectId } from "mongoose";

export interface IAdvertiser extends Document {
  email: string;
  name: string;
  username: string;
  password: string;
  phone_number: string;
  activities: ObjectId[];
  documents_required: string[];
  link_to_website: string;
  hotline: string;
  about: string;
  logo: string;
  company_profile: string;
}
export interface IAdvertiserCreateDTO {
  user_id: ObjectId;
  activities: ObjectId[];
  documents_required: string[];
  link_to_website: string;
  hotline: string;
  about: string;
  logo: string;
  company_profile: string;
}

export interface IAdvertiserUpdateDTO {
  activities?: ObjectId[];
  link_to_website?: string;
  hotline?: string;
  about?: string;
  logo?: string;
  company_profile?: string;
}
export interface IAdvertiserMain extends Document {
  email: string;
  name: string;
  username: string;
  password: string;
  phone_number: string;
  documents_required: string[];
}

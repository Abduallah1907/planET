import mongoose, { Document } from "mongoose";

type ObjectId = mongoose.Schema.Types.ObjectId;

export interface IAdvertiser extends Document {
  email: string;
  name: string;
  username: string;
  password: string;
  phone_number: string;
  activities?: ObjectId[];
  documents_required: mongoose.Schema.Types.ObjectId[];
  link_to_website?: string;
  hotline?: string;
  about?: string;
  logo?: mongoose.Schema.Types.ObjectId;
  company_profile?: string;
}
export interface IAdvertiserCreateDTO {
  user_id: ObjectId;
  activities: ObjectId[];
  documents_required: mongoose.Schema.Types.ObjectId[];
  link_to_website: string;
  hotline: string;
  about: string;
  logo?: mongoose.Schema.Types.ObjectId;
  company_profile: string;
}

export interface IAdvertiserUpdateDTO {
  newEmail?: string;
  name?: string;
  phone_number?: string;
  username?: string;
  password?: string;

  link_to_website?: string;
  hotline?: string;
  about?: string;
  logo?: mongoose.Schema.Types.ObjectId;
  company_profile?: string;
}
export interface IAdvertiserMain extends Document {
  email: string;
  name: string;
  username: string;
  password: string;
  phone_number: string;
  documents_required: mongoose.Schema.Types.ObjectId[];
}

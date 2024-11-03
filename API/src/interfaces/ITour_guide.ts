import mongoose, { Document } from "mongoose";
import {
  IPrevious_work,
  IPreviousWorkDeleteDTO,
  IPreviousWorkInputDTO,
  IPreviousWorkUpdateDTO,
} from "./IPrevious_work";

type ObjectId = mongoose.Schema.Types.ObjectId;

export interface ITour_Guide extends Document {
  user_id: ObjectId;
  itineraries: ObjectId[];
  comments: ObjectId[];
  years_of_experience?: number;
  previous_work_description: ObjectId[];
  documents_required: mongoose.Schema.Types.ObjectId[];
  logo?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ITour_GuideUpdateDTO {
  newEmail?: string;
  name?: string;
  phone_number?: string;
  username?: string;
  password?: string;
  years_of_experience?: number;
  logo?: mongoose.Schema.Types.ObjectId;
  createdPreviousWork?: IPreviousWorkInputDTO[];
  updatedPreviousWork?: IPreviousWorkUpdateDTO[];
  deletedPreviousWork?: IPreviousWorkDeleteDTO[];
}
export interface ITourGuideInput {
  username: string;
  email: string;
  phone_number: string;
  name: string;
  password: string;
  logo?: mongoose.Schema.Types.ObjectId;
  documents_required: mongoose.Schema.Types.ObjectId[];
}
export interface ITourGuideOutput {
  itineraries: ObjectId[];
  comments: ObjectId[];
  years_of_experience?: number;
  previous_work_description: IPrevious_work[];
  logo?: mongoose.Schema.Types.ObjectId;
  // the attributes below must be taken from user table
  username: string;
  name: string;
  phone_number: string;
}
export interface ITourGuideInfoOutputDTO {
  firstName: string;
  lastName: string;
  email: string;
  logo?: string;
  iternary_name: string;
}

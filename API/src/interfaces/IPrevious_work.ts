import { Document, ObjectId } from "mongoose";

export interface IPrevious_work extends Document {
  title: string;
  place: string;
  from: Date;
  to: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPreviousWorkInputDTO extends Document {
  title: string;
  place: string;
  from: Date;
  to: Date;
  tour_user_id: ObjectId;
}

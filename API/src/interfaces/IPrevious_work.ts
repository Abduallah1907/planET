import { Document, ObjectId } from "mongoose";
import { OnReadOpts } from "net";

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
  tour_guide_user_id: ObjectId;
}

export interface IPreviousWorkUpdateDTO extends Document {
  previous_work_id: ObjectId;
  title: string;
  place: string;
  from: Date;
  to: Date;
}

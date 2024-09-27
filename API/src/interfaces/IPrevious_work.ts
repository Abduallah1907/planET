import { Document, ObjectId } from 'mongoose';

export interface IPrevious_work extends Document {
  previous_work_id: ObjectId;
  title: string;
  place: string;
  from: Date;
  to: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

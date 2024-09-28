import { Document, ObjectId } from 'mongoose';

export interface IPrevious_Work extends Document {
  previous_work_id: ObjectId;
  title: string;
  place: string;
  from: Date;
  to: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

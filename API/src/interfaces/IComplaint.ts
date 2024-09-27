import { Document, ObjectId } from 'mongoose';

export interface IComplaint extends Document {
  complaint_id: ObjectId;
  user_id: ObjectId;
  title: string;
  date: Date;
  status: 'Pending' | 'Resolved';
  reply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

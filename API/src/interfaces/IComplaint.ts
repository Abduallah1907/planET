import { Document, ObjectId } from 'mongoose';

export interface IComplaint extends Document {
  user_id: ObjectId;
  title: string;
  date: Date;
  status: 'Pending' | 'Resolved';
  reply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

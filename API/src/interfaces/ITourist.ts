import { Document, ObjectId } from 'mongoose';

export interface ITourist extends Document {

  user_id: ObjectId;
  bookmarks: ObjectId[];
  date_of_birth: Date;
  job: string;
  nation: string;
  wallet: number;
  loyality_points: number;
  badge: '1' | '2' | '3';
  addresses: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

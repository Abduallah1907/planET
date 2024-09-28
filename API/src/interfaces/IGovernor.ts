import { Document, ObjectId } from 'mongoose';

export interface IGovernor extends Document {
  user_id: ObjectId;
  historical_locations: ObjectId[];
  nation:string;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Document, ObjectId } from 'mongoose';

export interface IGovernor extends Document {
  governor_id: ObjectId;
  user_id: ObjectId;
  historical_locations: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

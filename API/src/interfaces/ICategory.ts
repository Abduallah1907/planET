import { Document, ObjectId } from 'mongoose';

export interface ICategory extends Document {
  category_id: ObjectId;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

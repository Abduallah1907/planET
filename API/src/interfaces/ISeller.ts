import { Document, ObjectId } from 'mongoose';

export interface ISeller extends Document {
  seller_id: ObjectId;
  user_id: ObjectId;
  documents_required: string[];
  logo: string;
  description: string;
  approval: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

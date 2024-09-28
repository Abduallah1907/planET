import { Document, ObjectId } from 'mongoose';


export interface ISellerOutputDTO {
  email: string;
  name: string;
  username: string;
  phone_number: string;
  logo: string;
  description: string;
}


export interface ISeller extends Document {
 
  user_id: ObjectId;
  documents_required: string[];
  logo: string;
  description: string;
  approval: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

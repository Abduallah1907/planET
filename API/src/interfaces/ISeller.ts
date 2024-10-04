import e from 'express';
import { Document, ObjectId } from 'mongoose';


export interface ISellerOutputDTO {
  email: string;
  name: string;
  username: string;
  phone_number: string;
  logo: string;
  description: string;
}

export interface ISellerInputDTO {
  documents_required: string[];
  logo: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  date_of_birth: Date;
}


export interface ISeller extends Document {
 
  user_id: ObjectId;
  documents_required: string[];
  logo: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

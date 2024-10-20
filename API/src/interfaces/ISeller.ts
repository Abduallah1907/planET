import e from "express";
import mongoose, { Document, ObjectId } from "mongoose";

export interface ISellerOutputDTO {
  email: string;
  name: string;
  username: string;
  phone_number: string;
  logo?: mongoose.Schema.Types.ObjectId;
  description: string;
  products: ObjectId[];
}

export interface ISellerInputDTO {
  documents_required: mongoose.Schema.Types.ObjectId[];
  name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  date_of_birth: Date;
}

export interface ISellerUpdateDTO {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  phone_number?: string;
  description?: string;
  logo?: mongoose.Schema.Types.ObjectId;
}

export interface ISeller extends Document {
  user_id: ObjectId;
  documents_required: mongoose.Schema.Types.ObjectId[];
  logo?: mongoose.Schema.Types.ObjectId;
  description: string;
  products: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

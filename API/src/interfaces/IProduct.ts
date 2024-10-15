import mongoose, { Document, ObjectId } from "mongoose";

export interface IProduct extends Document {
  comments: ObjectId[];
  name: string;
  description: string;
  image?: mongoose.Schema.Types.ObjectId;
  price: number;
  quantity: number;
  sales: number;
  archieve_flag: boolean;
  tourist_id?: ObjectId[];
  seller_id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductInputDTO {
  name?: string;
  description?: string;
  image?: mongoose.Schema.Types.ObjectId;
  price?: number;
  quantity?: number;
  sales?: number;
  archieve_flag?: boolean;
  seller_id?: ObjectId;
}

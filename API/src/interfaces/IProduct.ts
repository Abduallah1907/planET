import { Document, ObjectId } from "mongoose";

export interface IProduct extends Document {
  comments: ObjectId[];
  name: string;
  description: string;
  picture: string;
  price: number;
  quantity: number;
  sales: number;
  archieve_flag: boolean;
  seller_id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductInputDTO {
  name?: string;
  description?: string;
  picture?: string;
  price?: number;
  quantity?: number;
  sales?: number;
  archieve_flag?: boolean;
  seller_id?: ObjectId;
}

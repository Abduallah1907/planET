import { Document, ObjectId } from "mongoose";

export interface ICategory extends Document {
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICategoryDTO {
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

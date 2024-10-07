import { Document, ObjectId } from "mongoose";
export interface IHistorical_tag extends Document {
  name: string;
  Values: string[];
}
export interface IHistorical_tagDTO {
  name?: string;
  Values?: string[];
}

import { Document, ObjectId } from "mongoose";
export interface IHistorical_tag extends Document {
  name: string;
  values: string[];
}
export interface IHistorical_tagDTO {
  name?: string;
  values?: string[];
}

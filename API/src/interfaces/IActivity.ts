import { Document,ObjectId } from 'mongoose';


export interface IActivityOutputDTO {
  category_type:string;
  comments: ObjectId[];
  name: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
  inappropriate_flag: boolean;
  active_flag: boolean;
  advertiser_id:ObjectId;

}


export interface IActivity extends Document {
  category: ObjectId;
  comments: ObjectId[];
  name: string;
  date: Date;
  time: string;
  location: string;
  price: number;
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
  inappropriate_flag: boolean;
  active_flag: boolean;
  advertiser_id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

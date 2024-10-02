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
  location: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional) check the users story 21 in azure
    min: number;
    max: number;
  };
  date_time: Date;
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

export interface IActivityDTO {
  name: string;
  date: Date;
  time: string;
  location: Location; // [longitude, latitude];
  price?: number; // Single price (optional)
  price_range?: {
    // Price range (optional)
    min: number;
    max: number;
  };
  category: ObjectId;
  special_discount?: number;
  tags?: string[];
  booking_flag: boolean;
  advertiser_id: ObjectId;
}

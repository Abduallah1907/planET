import mongoose, { Document } from "mongoose";

export interface IAddress extends Document {
  street_name: string;
  apartment_number: string;
  city: string;
  country: string;
  postal_code?: number;
}

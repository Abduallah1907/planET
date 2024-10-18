//import { IHistorical_tag } from "./IHistorical_tag";
export interface IHistorical_location {
  _id: string;
  governor_id: string;
  comments: string[];
  name: string;
  description: string;
  images?: string[];
  location: Location;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
  native_price: number;
  foreign_price: number;
  student_price: number;
  active_flag: boolean;
  average_rating: number;
  tags?: Map<string, string>;
  date_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  reviewsCount?: number;
}
export interface IHistorical_locationDTO {
  _id: string;
  name: string;
  governor_id: string;

  description: string;

  images?: string[];

  location: Location;

  opening_hours_from: string;

  opening_hours_to: string;

  native_price: number;

  foreign_price: number;

  student_price: number;

  average_rating: number;

  tags?: Map<string, string>;
  reviewsCount?: number;
}

export interface Update_IHistorical_locationDTO {
  name?: string;

  description?: string;

  images?: string[];

  location?: Location;

  opening_hours_from?: string;

  opening_hours_to?: string;

  native_price?: number;

  foreign_price?: number;

  student_price?: number;

  average_rating?: number;

  tags?: Map<string, string>;
  reviewsCount?: number;
}
export interface IHistorical_location_tourist {
  _id: string;
  governor_id: string;
  comments: string[];
  name: string;
  description: string;
  images?: string[];
  location: Location;
  opening_hours_from: string;
  opening_hours_to: string;
  opening_days: string[];
  price: number;
  active_flag: boolean;
  average_rating: number;
  tags?: Map<string, string>;
  date_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  reviewsCount?: number;
}

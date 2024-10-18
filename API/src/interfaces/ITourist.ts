import TouristBadge from "@/types/enums/touristBadge";
import mongoose, { Document, mongo, ObjectId } from "mongoose";
import { Cart } from "@/types/Cart";
import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";

export interface ITouristOutputDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRoles;
  phone_number: string;
  status: UserStatus;
  date_of_birth: Date;
  job: string;
  nation: string;
  wallet: number;
  loyality_points: number;
  badge: TouristBadge;
  addresses: string[];
  logo?: mongoose.Schema.Types.ObjectId;
  // cart: Cart;
  // wishlist: ObjectId[];
}

export interface ITourist extends Document {
  bookmarks: ObjectId[];
  job: string;
  nation: string;
  wallet: number;
  loyality_points: number;
  badge: TouristBadge;
  addresses: string[];
  cart: Cart;
  wishlist: ObjectId[];
  date_of_birth: Date;
  logo?: mongoose.Schema.Types.ObjectId;
  total_loyality_points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITouristCreateDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  job: string;
  nation: string;
  date_of_birth: Date;
  logo?: mongoose.Schema.Types.ObjectId;
}

export interface ITouristNewUserDTO {
  user_id: ObjectId;
  job: string;
  nation: string;
  date_of_birth: Date;
  logo?: mongoose.Schema.Types.ObjectId;
}

export interface ITouristUpdateDTO {
  name?: string;
  newEmail?: string;
  password?: string;
  phone_number?: string;
  job?: string;
  nation?: string;
  addresses?: string[];
  logo?: mongoose.Schema.Types.ObjectId;
}

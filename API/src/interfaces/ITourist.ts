import TouristBadge from '@/types/enums/touristBadge';
import { Document, ObjectId } from 'mongoose';
import { Cart } from '@/types/Cart';
import UserRoles from '@/types/enums/userRoles';
import UserStatus from '@/types/enums/userStatus';


export interface ITouristOutputDTO {
  name: string,
  username: string,
  email: string,
  password: string,
  role: UserRoles,
  phone_number: string,
  status: UserStatus,
  date_of_birth: Date;
  job: string;
  nation: string;
  wallet: number;
  loyality_points: number;
  badge: TouristBadge;
  addresses: string[];
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
}

export interface ITouristNewUserDTO {
  user_id: ObjectId;
  job: string;
  nation: string;
  date_of_birth: Date;
}

export interface ITouristUpdateDTO {
  searchEmail: string;
  name: string;
  newEmail: string;
  password: string;
  phone_number: string;
  job: string;
  nation: string;
  addresses: string[];
}
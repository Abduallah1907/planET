import TouristBadge from '@/types/enums/touristBadge';
import { Document, ObjectId } from 'mongoose';
import { Cart } from '@/types/Cart';
import  UserRoles from '@/types/enums/userRoles';
import  UserStatus  from '@/types/enums/userStatus';


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

  user_id: ObjectId;
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

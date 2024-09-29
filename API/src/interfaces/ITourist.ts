import TouristBadge from '@/types/enums/touristBadge';
import { Document, ObjectId } from 'mongoose';
import { Cart } from '@/types/Cart';

export interface ITourist extends Document {

  user_id: ObjectId;
  bookmarks: ObjectId[];
  date_of_birth: Date;
  job: string;
  nation: string;
  wallet: number;
  loyality_points: number;
  badge: TouristBadge;
  addresses: string[];
  cart: Cart;
  wishlist: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

import OrderStatus from "@/types/enums/orderStatus";
import PaymentType from "@/types/enums/paymentType";
import { Document, ObjectId } from "mongoose";
import { Cart } from "@/types/Cart";

export interface IOrder extends Document {
  tourist_id: ObjectId;
  products: Cart;
  date: Date;
  cost: number;
  status: OrderStatus;
  payment_type: PaymentType;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IOrderCartDTO {
  tourist_id: ObjectId;
  cart: Cart;
  cost: number;
  payment_type: PaymentType;
  promoCode?: string;
}

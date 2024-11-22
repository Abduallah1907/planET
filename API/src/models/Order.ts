import { IOrder } from "@/interfaces/IOrder";
import OrderStatus from "@/types/enums/orderStatus";
import PaymentType from "@/types/enums/paymentType";
import mongoose from "mongoose";
import CartSchema from "@/types/Cart";

const orderSchema = new mongoose.Schema(
  {
    tourist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    products: {
      type: CartSchema,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
      required: true,
    },
    payment_type: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder & mongoose.Document>("Order", orderSchema);

export default Order;

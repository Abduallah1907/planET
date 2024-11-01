import { IOrder } from "@/interfaces/IOrder";
import OrderStatus from "@/types/enums/orderStatus";
import PaymentType from "@/types/enums/paymentType";
import mongoose from "mongoose";
import Cart_ItemSchema from "@/types/Cart";

const orderSchema = new mongoose.Schema(
  {
    tourist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    products: [
      {
        type: Cart_ItemSchema,
        required: true,
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    cost: {
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
    points_received: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder & mongoose.Document>("Order", orderSchema);

export default Order;

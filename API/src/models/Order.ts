import { IOrder } from "@/interfaces/IOrder";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart_item",
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
      enum: ["pending", "cancelled", "delivered"],
      required: true,
    },
    payment_type: {
      type: String,
      enum: ["credit card", "cash"],
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder & mongoose.Document>("Order", orderSchema);

export default Order;

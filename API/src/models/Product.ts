import { IProduct } from "@/interfaces/IProduct";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment_Rating",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      required: true,
    },
    average_rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
      default: 0,
    },
    archieve_flag: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct & mongoose.Document>(
  "Product",
  productSchema
);

export default Product;

import { ISeller } from "@/interfaces/ISeller";
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documents_required: [
      {
        type: String,
        default: [],
        required: true,
      },
    ],
    logo: {
      type: String,
      default: "NONE",
    },
    description: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Seller = mongoose.model<ISeller & mongoose.Document>(
  "Seller",
  sellerSchema
);

export default Seller;

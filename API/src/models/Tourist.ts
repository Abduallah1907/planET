import { ITourist } from "@/interfaces/ITourist";
import TouristBadge from "@/types/enums/touristBadge";
import mongoose from "mongoose";
import CartSchema from "@/types/Cart"; // Adjust the import path as necessary

const touristSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    job: {
      type: String,
      required: true,
    },
    nation: {
      type: String,
      required: true,
    },
    wallet: {
      type: Number,
      required: true,
      default: 0,
    },
    loyality_points: {
      type: Number,
      default: 0,
    },
    total_loyality_points: {
      type: Number,
      default: 0,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    badge: {
      type: String,
      enum: Object.values(TouristBadge),
      default: TouristBadge.LEVEL1,
    },
    addresses: [
      {
        type: String,
      },
    ],
    cart: {
      type: CartSchema,
      default: { items: [], cost: 0 },
      // required: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "upload.files", // Reference the correct collection
    },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
  },
  { timestamps: true }
);

const Tourist = mongoose.model<ITourist & mongoose.Document>(
  "Tourist",
  touristSchema
);

export default Tourist;

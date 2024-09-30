import { IActivity } from "@/interfaces/IActivity";
import { LocationSchema } from "@/types/Location";
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment_rating",
      },
    ],
    name: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: LocationSchema, // [longitude, latitude],
      required: true,
    },
    price: { type: Number, required: false }, // Optional single price
    price_range: {
      min: { type: Number, required: false }, // Optional price range
      max: { type: Number, required: false },
    },
    special_discount: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    booking_flag: {
      type: Boolean,
      required: true,
    },
    inappropriate_flag: {
      type: Boolean,
      required: false,
    },
    active_flag: {
      type: Boolean,
      required: false,
    },
    adverstier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
  },
  { timestamps: true }
);
// Pre-save validation to ensure only one of `price` or `priceRange` is provided

const Activity = mongoose.model<IActivity & mongoose.Document>(
  "Activity",
  activitySchema
);

export default Activity;

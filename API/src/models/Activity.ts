import { IActivity } from "@/interfaces/IActivity";
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    activity_id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
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
      type: String,
      required: true,
    },
    price: { type: Number, required: false }, // Optional single price
    priceRange: {
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
  },
  { timestamps: true }
);
// Pre-save validation to ensure only one of `price` or `priceRange` is provided
activitySchema.pre("save", function (next) {
  const activity = this;

  // Check if both price and priceRange are provided
  if (activity.price && activity.priceRange) {
    return next(
      new Error("You must provide either price or priceRange, but not both.")
    );
  }

  // Check if neither price nor priceRange are provided
  if (
    !activity.price &&
    (!activity.priceRange ||
      !activity.priceRange.min ||
      !activity.priceRange.max)
  ) {
    return next(new Error("You must provide either price or priceRange."));
  }

  next();
});

const Activity = mongoose.model<IActivity & mongoose.Document>(
  "Activity",
  activitySchema
);

export default Activity;

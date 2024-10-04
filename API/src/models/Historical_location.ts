import { IHistorical_location } from "@/interfaces/IHistorical_location";
import Historical_tagSchema from "@/types/Historical_tags";
import { LocationSchema } from "@/types/Location";
import mongoose from "mongoose";

const historicalLocationSchema = new mongoose.Schema(
  {
    governor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Governor",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment_Rating",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picture: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      type: LocationSchema,
      required: true,
    },
    opening_hours_from: {
      type: String, // Assuming time is stored as a string
      required: true,
    },
    opening_hours_to: {
      type: String, // Assuming time is stored as a string
      required: true,
    },
    opening_days: [
      {
        type: String,
      },
    ],
    native_price: {
      type: Number,
    },
    foreign_price: {
      type: Number,
    },
    student_price: {
      type: Number,
    },
    active_flag: {
      type: Boolean,
    },
    tags: {
      type: Historical_tagSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const Historical_location = mongoose.model<
  IHistorical_location & mongoose.Document
>("Historical_Location", historicalLocationSchema);

export default Historical_location;

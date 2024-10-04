<<<<<<< HEAD
import { IHistorical_location } from "@/interfaces/IHistorical_Location";
=======
import { IHistorical_location } from "@/interfaces/IHistorical_location";
import { LocationSchema } from "@/types/Location";
>>>>>>> backend
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
      required: true,
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
<<<<<<< HEAD
      type: String,
=======
      type: LocationSchema,
>>>>>>> backend
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
        required: true,
      },
    ],
    native_price: {
      type: Number,
      required: true,
    },
    foreign_price: {
      type: Number,
      required: true,
    },
    student_price: {
      type: Number,
      required: true,
    },
    active_flag: {
      type: Boolean,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

<<<<<<< HEAD
const Historical_location = mongoose.model<IHistorical_location & mongoose.Document>("Historical_Location", historicalLocationSchema);
=======
const Historical_location = mongoose.model<
  IHistorical_location & mongoose.Document
>("Historical_Location", historicalLocationSchema);
>>>>>>> backend

export default Historical_location;

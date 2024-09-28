import { IItinerary } from "@/interfaces/IItinerary";
import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    itinerary_id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    timeline: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment_Rating",
      },
    ],
    locations: [
      {
        type: String,
        required: true,
      },
    ],
    duration: {
      type: String, // Assuming duration is stored as a string representing time
      required: true,
    },
    languages: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    available_dates: [
      {
        type: Date,
        required: true,
      },
    ],
    accessibility: {
      type: Boolean,
      required: true,
    },
    pickup_loc: {
      type: String,
      required: true,
    },
    drop_off_loc: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    active_flag: {
      type: Boolean,
      required: true,
    },
    inappropriate_flag: {
      type: Boolean,
      required: true,
    },
    tour_guide_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour_Guide",
      required: true,
    },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model<IItinerary & mongoose.Document>(
  "Itinerary",
  itinerarySchema
);

export default Itinerary;

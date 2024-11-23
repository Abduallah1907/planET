import { IItinerary } from "@/interfaces/IItinerary";
import { LocationSchema } from "@/types/Location";
import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "upload.files", // Reference the correct collection
    },
    name: {
      type: String,
      required: true,
    },
    locations: [
      {
        type: LocationSchema,
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
    average_rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
      default: 0,
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
      type: LocationSchema,
      required: true,
    },
    drop_off_loc: {
      type: LocationSchema,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    active_flag: {
      type: Boolean,
      required: true,
    },
    inappropriate_flag: {
      type: Boolean,
      required: true,
      default: false,
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

import { ITour_Guide } from "@/interfaces/ITour_guide";
import mongoose, { mongo } from "mongoose";

const tourGuideSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment_Rating",
      },
    ],
    years_of_experience: {
      type: Number,
    },
    previous_work_description: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Previous_Work",
      },
    ],
    documents_required: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    logo: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Tour_Guide = mongoose.model<ITour_Guide & mongoose.Document>(
  "Tour_Guide",
  tourGuideSchema
);

export default Tour_Guide;

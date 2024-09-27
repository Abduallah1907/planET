import { IAdvertiser } from "@/interfaces/IAdvertiser";
import mongoose from "mongoose";

const advertiserSchema = new mongoose.Schema(
  {
    advertisor_id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    documents_required: [
      {
        type: String,
        required: true,
      },
    ],
    link_to_website: {
      type: String,
      required: true,
    },
    hotline: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    approval: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Advertisor = mongoose.model<IAdvertiser & mongoose.Document>(
  "Advertiser",
  advertiserSchema
);

export default Advertisor;

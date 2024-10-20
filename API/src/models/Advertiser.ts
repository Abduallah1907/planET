import { IAdvertiser } from "@/interfaces/IAdvertiser";
import mongoose, { mongo } from "mongoose";

const advertiserSchema = new mongoose.Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "upload.files", // Reference the correct collection
        required: true,
      },
    ],
    link_to_website: {
      type: String,
      // required: true,
    },
    hotline: {
      type: String,
      // required: true,
    },
    about: {
      type: String,
      // required: true,
    },
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "upload.files", // Reference the correct collection
    },
    company_profile: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Advertisor = mongoose.model<IAdvertiser & mongoose.Document>(
  "Advertiser",
  advertiserSchema
);

export default Advertisor;

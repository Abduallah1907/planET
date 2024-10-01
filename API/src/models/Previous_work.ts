import { IPrevious_work } from "@/interfaces/IPrevious_work";
import mongoose from "mongoose";

const previousWorkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Previous_Work = mongoose.model<IPrevious_work & mongoose.Document>("Previous_Work", previousWorkSchema);

export default Previous_Work;

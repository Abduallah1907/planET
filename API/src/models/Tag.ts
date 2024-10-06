import mongoose from "mongoose";
import { ITag } from "@/interfaces/ITag";
import { unique } from "agenda/dist/job/unique";
const tagSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model<ITag & mongoose.Document>("Tag", tagSchema);

export default Tag;

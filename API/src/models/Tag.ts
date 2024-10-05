import mongoose from "mongoose";
import { ITag } from "@/interfaces/ITag";
const tagSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model<ITag & mongoose.Document>("Tag", tagSchema);

export default Tag;

import { IHistorical_tag } from "@/interfaces/IHistorical_tag";
import { name } from "agenda/dist/agenda/name";
import mongoose from "mongoose";
const historicalTagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    values: [{ type: String, required: true }],
  },
  { timestamps: true }
);
const Historical_tag = mongoose.model<IHistorical_tag & mongoose.Document>(
  "Historical_Tag",
  historicalTagSchema
);

export default Historical_tag;

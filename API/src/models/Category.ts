import { ICategory } from "@/interfaces/ICategory";
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory & mongoose.Document>(
  "Category",
  categorySchema
);

export default Category;

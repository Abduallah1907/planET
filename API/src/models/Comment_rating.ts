import { IComment_Rating } from "../interfaces/IComment_rating";
import mongoose from "mongoose";

const commentRatingSchema = new mongoose.Schema(
  {
    tourist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment_Rating = mongoose.model<IComment_Rating & mongoose.Document>(
  "Comment_Rating",
  commentRatingSchema
);

export default Comment_Rating;

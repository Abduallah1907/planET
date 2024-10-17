import { IWishlist } from "@/interfaces/IWishlist";
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    tourist_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tourist",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model<IWishlist & mongoose.Document>(
  "Wishlist",
  wishlistSchema
);

export default Wishlist;

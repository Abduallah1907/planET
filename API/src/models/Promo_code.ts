import { IPromo_code } from "@/interfaces/IPromo_code";
import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Promo_Code = mongoose.model<IPromo_code & mongoose.Document>("Promo_Code", promoCodeSchema);

export default Promo_Code;

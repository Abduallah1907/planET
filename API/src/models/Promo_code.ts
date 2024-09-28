import { IPromo_Code } from "@/interfaces/IPromo_Code";
import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    promo_code_id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    code: {
      type: String,
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

const Promo_Code = mongoose.model<IPromo_Code & mongoose.Document>("Promo_Code", promoCodeSchema);

export default Promo_Code;

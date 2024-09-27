import { IPromo_code } from "@/interfaces/IPromo_code";
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

const Promo_code = mongoose.model<IPromo_code & mongoose.Document>(
  "Promo_code",
  promoCodeSchema
);

export default Promo_code;

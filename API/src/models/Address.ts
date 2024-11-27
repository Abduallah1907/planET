import mongoose from "mongoose";
import { IAddress } from "@/interfaces/IAddress";

const addressSchema = new mongoose.Schema(
  {
    street_name: {
      type: String,
      required: true,
    },
    apartment_number: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postal_code: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Address = mongoose.model<IAddress & mongoose.Document>("Address", addressSchema);

export default Address;

import { ObjectId, SchemaType } from "mongoose";
import { Schema, model, Document } from "mongoose";

const LocationSchema = new Schema({
  // [longitude, latitude];
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
});

type Location = {
  longitude: Number;
  latitude: Number;
};
export { LocationSchema };
export type { Location };

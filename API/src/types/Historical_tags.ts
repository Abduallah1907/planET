import { Schema } from "mongoose";
const Historical_tagSchema = new Schema({
  name: { type: String, required: true },
  Values: [{ type: String, required: true }],
});
type historical_tag = {
  name: string;
  Values: string[];
};
export default { Historical_tagSchema };
export type { historical_tag };

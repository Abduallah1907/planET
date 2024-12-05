import { ObjectId } from "mongoose";
import { Schema } from "mongoose";

const Cart_ItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const CartSchema = new Schema({
  items: [{ type: Cart_ItemSchema, required: true }],
  cost: { type: Number, required: true },
});

type Cart = {
  items: Cart_Item[];
  cost: number;
};

type Cart_Item = {
  product_id: ObjectId;
  quantity: number;
};

export default CartSchema;
export type { Cart };

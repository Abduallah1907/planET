import { ObjectId, SchemaType } from 'mongoose';
import { Interface } from 'readline';
import { Schema, model, Document } from 'mongoose';

const CartSchema = new Schema({
  items: [{ type: Schema.Types.ObjectId, ref: 'Cart_Item' }],
  cost: { type: Number, required: true },
});

const Cart_ItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

type Cart = {
  items: ObjectId[];
  cost: number;
};

type Cart_Item = {
  product_id: ObjectId;
  quantity: number;
};


export { CartSchema, Cart_ItemSchema };
export type { Cart, Cart_Item };


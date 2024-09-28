import { ICart_item } from '@/interfaces/ICart_item';
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Cart_item = mongoose.model<ICart_item & mongoose.Document>('Cart_item', cartItemSchema);

export default Cart_item;

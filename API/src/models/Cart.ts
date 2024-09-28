import { ICart } from '@/interfaces/ICart';
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart_item',
    required: true,
  }],
  cost: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Cart = mongoose.model<ICart & mongoose.Document>('Cart', cartSchema);

export default Cart;

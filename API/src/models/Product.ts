import { IProduct } from '@/interfaces/IProduct';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment_Rating',
  }],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    required: true,
  },
  archieve_flag: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const Product = mongoose.model<IProduct & mongoose.Document>('Product', productSchema);

export default Product;

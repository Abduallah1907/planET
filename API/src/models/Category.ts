import { ICategory } from '@/interfaces/ICategory';
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  type: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Category = mongoose.model<ICategory & mongoose.Document>('Category', categorySchema);

export default Category;

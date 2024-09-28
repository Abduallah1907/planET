import { ISeller } from '@/interfaces/ISeller';
import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documents_required: [{
    type: String,
    required: true,
  }],
  logo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  approval: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const Seller = mongoose.model<ISeller & mongoose.Document>('Seller', sellerSchema);

export default Seller;

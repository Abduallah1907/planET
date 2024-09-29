import { IPrevious_Work } from '@/interfaces/IPrevious_Work';
import mongoose from 'mongoose';

const previousWorkSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

const Previous_Work = mongoose.model<IPrevious_Work & mongoose.Document>('Previous_Work', previousWorkSchema);

export default Previous_Work;

import { IPrevious_work } from '@/interfaces/IPrevious_work';
import mongoose from 'mongoose';

const previousWorkSchema = new mongoose.Schema({
  previous_work_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
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

const Previous_work = mongoose.model<IPrevious_work & mongoose.Document>('Previous_work', previousWorkSchema);

export default Previous_work;

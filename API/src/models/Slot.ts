import { ISlot } from '@/interfaces/ISlot';
import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  from: {
    type: String, // Assuming time is stored as a string
    required: true,
  },
  to: {
    type: String, // Assuming time is stored as a string
    required: true,
  }
}, { timestamps: true });

const Slot = mongoose.model<ISlot & mongoose.Document>('Slot', slotSchema);

export default Slot;

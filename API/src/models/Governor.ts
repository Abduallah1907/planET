import { IGovernor } from '@/interfaces/IGovernor';
import mongoose from 'mongoose';

const governorSchema = new mongoose.Schema({
  governor_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  historical_locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Historical_location',
  }]
}, { timestamps: true });

const Governor = mongoose.model<IGovernor & mongoose.Document>('Governor', governorSchema);

export default Governor;

import { IAdvertisor } from '@/interfaces/IAdvertisor';
import mongoose from 'mongoose';

const advertisorSchema = new mongoose.Schema({
  advertisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
  }],
  documents_required: [{
    type: String,
    required: true,
  }],
  link_to_website: {
    type: String,
    required: true,
  },
  hotline: {
    type: String,
    required: true,
  },
  About: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  approval: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const Advertisor = mongoose.model<IAdvertisor & mongoose.Document>('Advertisor', advertisorSchema);

export default Advertisor;

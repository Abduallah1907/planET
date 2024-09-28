import { IActivity } from '@/interfaces/IActivity';
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment_rating',
  }],
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  special_discount: {
    type: Number,
  },
  tags: [{
    type: String,
  }],
  booking_flag: {
    type: Boolean,
    required: true,
  },
  inappropriate_flag: {
    type: Boolean,
    required: true,
  },
  active_flag: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const Activity = mongoose.model<IActivity & mongoose.Document>('Activity', activitySchema);

export default Activity;

import { ITourist } from '@/interfaces/ITourist';
import mongoose from 'mongoose';


const touristSchema = new mongoose.Schema({
  tourist_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
  }],
  date_of_birth: {
    type: Date,
    required: true,
    // validate: {
    //   validator: function(value) {
    //     // Check if the date of birth indicates the user is older than 18
    //     const today = new Date();
    //     const age = today.getFullYear() - value.getFullYear();
    //     const month = today.getMonth() - value.getMonth();
    //     if (month < 0 || (month === 0 && today.getDate() < value.getDate())) {
    //       age--;
    //     }
    //     return age >= 18;
    //   },
    //   message: 'Tourist must be at least 18 years old.'
    // }
  },
  job: {
    type: String,
    required: true,
  },
  nation: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    required: true,
    immutable: true, // This makes the field non-editable after creation
  },
  loyality_points: {
    type: Number,
    required: true,
  },
  badge: {
    type: String,
    enum: ['1', '2', '3'],
    required: true,
  },
  addresses: [{
    type: String,
    required: true,
  }]
}, { timestamps: true });

const Tourist = mongoose.model<ITourist & mongoose.Document>('Tourist', touristSchema);

export default Tourist;
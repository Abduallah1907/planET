import { ITourist } from '@/interfaces/ITourist';
import Cart from '@/types/Cart';
import TouristBadge from '@/types/enums/touristBadge';
import mongoose from 'mongoose';
import CartSchema from '@/types/Cart'; // Adjust the import path as necessary


const touristSchema = new mongoose.Schema({
  
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
  },
  loyality_points: {
    type: Number,
    required: true,
  },
  badge: {
    type: String,
    enum: Object.values(TouristBadge),
    required: true,
  },
  addresses: [{
    type: String,
    required: true,
  }],
  cart:{
    type: CartSchema,
    default: {items: [], cost: 0},
    required: true,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, { timestamps: true });

const Tourist = mongoose.model<ITourist & mongoose.Document>('Tourist', touristSchema);

export default Tourist;
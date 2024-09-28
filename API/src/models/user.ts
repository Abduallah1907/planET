import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const UserSchema = new mongoose.Schema(
  {
    
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      enum: ['tourist', 'tourguide', 'advertisor', 'governor', 'admin', 'seller'],
      default: 'tourist',
      required: true,
    },
    phone_number: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const user=mongoose.model<IUser & mongoose.Document>('User', UserSchema);

export default user;



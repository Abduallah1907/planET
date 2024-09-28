import mongoose from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import UserRoles from '@/types/enums/userRoles';
import UserStatus from '@/types/enums/userStatus';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      unique: true,
      index: true,
      immutable: (user: any) => user.role !== UserRoles.Admin,
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
      enum: Object.values(UserRoles),
      default: UserRoles.Tourist,
      immutable: true,
      required:true,
    },
    phone_number: {
      type: String,
    },
    first_time_login: {
      type: Boolean,
      required: true,
      default: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(UserStatus),
      default: UserStatus.WAITING_FOR_APPROVAL,
    },
  },
  { timestamps: true },
);

const User=mongoose.model<IUser & mongoose.Document>('User', UserSchema);

export default User;
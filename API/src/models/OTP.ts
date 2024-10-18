import IOTP from '@/interfaces/IOTP';
import mongoose, {Schema } from 'mongoose';

// Function to calculate the time 10 minutes from now
const getTenMinutesFromNow = (): Date => {
    const now = new Date();
    return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
};

// Function to calculate the start of the next day
const getStartOfNextDay = (): Date => {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return nextDay;
};

const OTPSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: getStartOfNextDay, expires: 300 }, // Automatically remove after 5 minutes
    createdAt: { type: Date, default: Date.now } // Automatically remove after 5 minutes
});

const OTP = mongoose.model<IOTP & mongoose.Document>('OTP', OTPSchema);

export default OTP;
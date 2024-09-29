import { IComplaint } from '@/interfaces/IComplaint';
import ComplaintStatus from '@/types/enums/complaintStatus';
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ComplaintStatus),
    default: ComplaintStatus.Pending,
    required: true,
  },
  reply: {
    type: String,
  }
}, { timestamps: true });

const Complaint = mongoose.model<IComplaint & mongoose.Document>('Complaint', complaintSchema);

export default Complaint;

import { IBookmark_Notify } from '@/interfaces/IBookmark_notify';
import mongoose from 'mongoose';

const bookmarkNotifySchema = new mongoose.Schema({
  
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const Bookmark_Notify = mongoose.model<IBookmark_Notify & mongoose.Document>('Bookmark_Notify', bookmarkNotifySchema);

export default Bookmark_Notify
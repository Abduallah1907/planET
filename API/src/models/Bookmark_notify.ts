import { IBookmark_notify } from '@/interfaces/IBookmark_notify';
import mongoose from 'mongoose';

const bookmarkNotifySchema = new mongoose.Schema({
  bookmark_notify_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
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

const Bookmark_notify = mongoose.model<IBookmark_notify & mongoose.Document>('Bookmark_notify', bookmarkNotifySchema);

export default Bookmark_notify
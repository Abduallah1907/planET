import { IComment_rating } from '@/interfaces/IComment_rating';
import mongoose from 'mongoose';

const commentRatingSchema = new mongoose.Schema({
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Comment_rating = mongoose.model<IComment_rating & mongoose.Document>('Comment_rating', commentRatingSchema);

export default Comment_rating;

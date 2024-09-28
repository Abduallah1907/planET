import { IComment_Rating } from '@/interfaces/IComment_Rating';
import mongoose from 'mongoose';

const commentRatingSchema = new mongoose.Schema({
  comment_rating_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
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

const Comment_Rating = mongoose.model<IComment_Rating & mongoose.Document>('Comment_Rating', commentRatingSchema);

export default Comment_Rating;

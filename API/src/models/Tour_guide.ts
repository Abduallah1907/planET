import { ITour_guide } from '@/interfaces/ITour_guide';
import mongoose from 'mongoose';

const tourGuideSchema = new mongoose.Schema({
  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itineraries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment_rating',
  }],
  years_of_experience: {
    type: Number,
  },
  previous_work_description: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Previous_work',
  }],
  documents_required: [{
    type: String,
    required: true,
  }],
  photo: {
    type: String,
    required: true,
  },
  approval: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const Tour_guide = mongoose.model<ITour_guide & mongoose.Document>('Tour_guide', tourGuideSchema);

export default Tour_guide;

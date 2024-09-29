import { Document, ObjectId } from 'mongoose';

export interface ITicket extends Document {
 
  user_id: ObjectId;
  type: 'Itinerary' | 'Activity';
  booking_id: ObjectId;
  cancelled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

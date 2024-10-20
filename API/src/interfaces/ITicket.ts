import TicketType from "@/types/enums/ticketType";
import { Document, ObjectId } from "mongoose";

export interface ITicket extends Document {
  tourist_id: ObjectId;
  type: TicketType;
  booking_id: ObjectId;
  price: Number;
  cancelled: boolean;
  points_received: Number;
  createdAt?: Date;
  updatedAt?: Date;
  time_to_attend: Date;
}

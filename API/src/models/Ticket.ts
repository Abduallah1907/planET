import { ITicket } from "@/interfaces/ITicket";
import TicketType from "@/types/enums/ticketType";
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    tourist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TicketType),
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Note: You might need to add conditional references based on the type
    },
    cancelled: {
      type: Boolean,
      required: true,
    },
    points_received: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model<ITicket & mongoose.Document>(
  "Ticket",
  ticketSchema
);

export default Ticket;

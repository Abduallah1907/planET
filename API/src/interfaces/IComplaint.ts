import ComplaintStatus from "@/types/enums/complaintStatus";
import { Document, ObjectId } from "mongoose";

export interface IComplaint extends Document {
  tourist_id: ObjectId;
  title: string;
  date: Date;
  body: string;
  status: ComplaintStatus;
  reply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IComplaintCreateDTO {
  title: string;
  date?: Date;
  body: string;
}

export interface IComplaintAdminViewDTO {
  tourist_name: ObjectId;
  complaint_id: ObjectId;
  body: string;
  reply?: string;
  title: string;
  date: Date;
  status: ComplaintStatus;
  createdAt?: Date;
}

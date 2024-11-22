import mongoose from "mongoose";

export interface ISalesReport {
  id: string;
  name: string;
  type: string;
  average_rating: number;
  date: Date;
  image?: mongoose.Schema.Types.ObjectId;
  revenue: number;
  total_revenue: number;
}
export interface ISalesReportTotal {
  salesReports: ISalesReport[];
  totalRevenue: number;
}

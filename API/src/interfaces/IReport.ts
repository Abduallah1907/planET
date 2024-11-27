import mongoose from "mongoose";

export interface ISalesReport {
  id: string;
  name: string;
  type: string;
  average_rating: number;
  date: Date;
  image?: mongoose.Schema.Types.ObjectId;
  revenue: number;
  first_buy: string;
  last_buy: string;
  total_revenue: number;
}
export interface ISalesReportTourists {
  id: string;
  name: string;
  type: string;
  average_rating: number;
  date: Date;
  image?: mongoose.Schema.Types.ObjectId;
  revenue: number;
  first_buy: string;
  last_buy: string;
  tourists_count: number;
  total_revenue: number;
}
export interface ISalesReportTotal {
  salesReports: ISalesReport[];
  totalRevenue: number;
}

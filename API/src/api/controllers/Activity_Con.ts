import activityModel from "../../models/Activity";
import mongoose from "mongoose";
import { Response, Request } from "express";
import { IActivity } from "../../interfaces/IActivity";

export const createActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    activity_id,
    time,
    location,
    price,
    priceRange,
    category,
    tags,
    special_discount,
    booking_flag,
  } = req.body;
  try {
    const activity = await activityModel.create({
      activity_id,
      time,
      location,
      price,
      priceRange,
      category,
      tags,
      special_discount,
      booking_flag,
    });
    res.status(201).json(activity);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message }); // Return the error message
    }
  }
};

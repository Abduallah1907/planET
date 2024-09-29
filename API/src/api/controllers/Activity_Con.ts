import activityModel from "../../models/Activity";
import { Response, Request } from "express";
import { IACtivityDTO } from "../../interfaces/IActivity";

export const createActivity = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    date,
    time,
    location, // [longitude, latitude]
    price,
    priceRange,
    category,
    tags,
    special_discount,
    booking_flag,
    adverstier_id,
  }: IACtivityDTO = req.body;
  try {
    const activity = await activityModel.create({
      date,
      time,
      location, // [longitude, latitude]
      price,
      priceRange,
      category,
      tags,
      special_discount,
      booking_flag,
      adverstier_id,
    });
    if (!activity) {
      res.status(400).json({ message: "Activity is missing data" });
    }
    res.status(201).json(activity);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message }); // Return the error message
    }
  }
};
//Get all Acivites in the DB
export const getAllActivities = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const activities = await activityModel.find({});
    res.status(200).json(activities);
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message });
  }
};
//Get Activites by _id
export const getActivityByID = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.body;
    const activity = await activityModel.findById(id);
    if (!activity) {
      return res.status(400).json({ message: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

//Get activites by Advisor ID

export const getActivityByAdvisor_ID = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { A_id } = req.body;
    const activity = await activityModel.findOne({ adverstior_id: A_id });
    if (!activity) {
      return res.status(400).json({ message: "Activity not found" });
    }
    res.status(200).json(activity);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

//Update activity using ID to find and of the things specified in
//task 21 in azure
export const updateActivity = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "No ID is found." });
  }
  try {
    // Find the activity by ID
    const activity = await activityModel.findById(id);
    if (!activity) {
      return res.status(400).json({ message: "Activity not found." });
    }
    //Get the want to update fields
    const updateFields: Partial<IACtivityDTO> = {};

    if (req.body.date) updateFields.date = req.body.date;
    if (req.body.time) updateFields.time = req.body.time;
    if (req.body.location && Array.isArray(req.body.location)) {
      updateFields.location = req.body.location;
    }
    if (req.body.price !== undefined) updateFields.price = req.body.price;
    if (req.body.priceRange) updateFields.priceRange = req.body.priceRange;
    if (req.body.category) updateFields.category = req.body.category;
    if (req.body.special_discount !== undefined)
      updateFields.special_discount = req.body.special_discount;
    if (req.body.tags) updateFields.tags = req.body.tags;
    if (req.body.booking_flag !== undefined)
      updateFields.booking_flag = req.body.booking_flag;

    // Update only the fields provided
    const updatedActivity = await activityModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true } // Returns the updated document
    );

    res.status(200).json({
      message: "Activity updated successfully.",
      data: updatedActivity,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
//Delete Activity using ID

export const deleteActivity = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "No ID is found in JSON." });
  }
  try {
    const user = await activityModel.findByIdAndDelete(id);
  } catch (error) {
    res.status(400).send("Activity not found in the DB");
  }
  res.status(200).send("Delete was successful");
};

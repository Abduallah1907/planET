import activityModel from "../../models/Activity";
import { Response, Request } from "express";
import { IActivityDTO } from "../../interfaces/IActivity";
import { BadRequestError, HttpError, NotFoundError } from "@/types/Errors";
import response from "../../types/responses/response";

// export const createActivity = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const {
//     date,
//     time,
//     location, // [longitude, latitude]
//     price,
//     price_range,
//     category,
//     tags,
//     special_discount,
//     booking_flag,
//     adverstier_id,
//   }: IActivityDTO = req.body;

//   const activity = await activityModel.create({
//     date,
//     time,
//     location, // [longitude, latitude]
//     price,
//     price_range,
//     category,
//     tags,
//     special_discount,
//     booking_flag,
//     adverstier_id,
//   });
//   if (!activity) {
//     throw new HttpError("Activity not created", 404);
//   }
//   const data: IActivityDTO = {
//     date: activity.date,
//     time: activity.time,
//     location: activity.location,
//     price: activity.price,
//     price_range: activity.price_range,
//     category: activity.category,
//     special_discount: activity.special_discount,
//     tags: activity.tags,
//     booking_flag: activity.booking_flag,
//     adverstier_id: activity.advertiser_id,
//   };
//   return new response(true, data, "Activity created", 200);
// };
//Get all Acivites in the DB
export class ActivityController {
  static getAllActivities(arg0: string, getAllActivities: any) {
    throw new Error("Method not implemented.");
  }
  public async getAllActivities(req: any, res: any) {
    const activities = await activityModel.find({});
    return new response(true, activities, "All activites are fetched", 200);
  }
}
//Get Activites by _id
// export const getActivityByID = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { id } = req.body;
//   const activity = await activityModel.findById(id);
//   if (!activity) {
//     throw new NotFoundError("No Activity with this ID");
//   }
//   return new response(true, activity, "Activity is found", 200);
// };

// //Get activites by Advisor ID

// export const getActivityByAdvisor_ID = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { A_id } = req.body;
//   const activity = await activityModel.findOne({ adverstior_id: A_id });
//   if (!activity) {
//     throw new NotFoundError("No Activity with this ID");
//   }
//   return new response(true, activity, "Activity is found", 200);
// };

// //Update activity using ID to find and of the things specified in
// //task 21 in azure
// export const updateActivity = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { id } = req.body;
//   if (!id) {
//     throw new BadRequestError("No ID was Found with Request");
//   }
//   // Find the activity by ID
//   const activity = await activityModel.findById(id);
//   if (!activity) {
//     throw new NotFoundError("No Activity with this ID");
//   }
//   //Get the want to update fields
//   const updateFields: Partial<IActivityDTO> = {};

//   if (req.body.date) updateFields.date = req.body.date;
//   if (req.body.time) updateFields.time = req.body.time;
//   if (req.body.location && Array.isArray(req.body.location)) {
//     updateFields.location = req.body.location;
//   }
//   if (req.body.price !== undefined) updateFields.price = req.body.price;
//   if (req.body.price_range) updateFields.price_range = req.body.price_range;
//   if (req.body.category) updateFields.category = req.body.category;
//   if (req.body.special_discount !== undefined)
//     updateFields.special_discount = req.body.special_discount;
//   if (req.body.tags) updateFields.tags = req.body.tags;
//   if (req.body.booking_flag !== undefined)
//     updateFields.booking_flag = req.body.booking_flag;
//   if (req.body.price && req.body.price_range) {
//     throw new BadRequestError(
//       "Cannot enter both price and price range,choose one of them"
//     );
//   }

//   // Update only the fields provided
//   const updatedActivity = await activityModel.findByIdAndUpdate(
//     id,
//     { $set: updateFields },
//     { new: true } // Returns the updated document
//   );

//   return new response(
//     true,
//     updatedActivity,
//     "Activity is Update Successfully",
//     200
//   );
// };
// //Delete Activity using ID

// export const deleteActivity = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { id } = req.body;
//   if (!id) {
//     return res.status(400).json({ message: "No ID is found in JSON." });
//   }
//   try {
//     const user = await activityModel.findByIdAndDelete(id);
//   } catch (error) {
//     res.status(400).send("Activity not found in the DB");
//   }
//   res.status(200).send("Delete was successful");
// };

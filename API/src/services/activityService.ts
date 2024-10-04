import { IActivityDTO } from "@/interfaces/IActivity";
import { BadRequestError, InternalServerError, NotFoundError } from "@/types/Errors";
import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import mongoose, { Types } from "mongoose";
@Service()
export default class ActivityService {
  constructor(
    @Inject("activityModel") private activityModel: Models.ActivityModel,
    @Inject("categoryModel") private categoryModel: Models.CategoryModel
  ) { }

  public getAllActivitiesService = async () => {
    const activities = await this.activityModel.find({});
    return new response(true, activities, "All activites are fetched", 200);
  };

  public createActivityService = async (activityDatainput: IActivityDTO) => {
    const activityData: IActivityDTO = {
      name: activityDatainput.name,
      date: activityDatainput.date,
      time: activityDatainput.time,
      location: activityDatainput.location, // [longitude, latitude]
      price: activityDatainput.price,
      price_range: activityDatainput.price_range,
      category: activityDatainput.category,
      tags: activityDatainput.tags,
      special_discount: activityDatainput.special_discount,
      booking_flag: activityDatainput.booking_flag,
      advertiser_id: activityDatainput.advertiser_id,
    };
    if (
      activityData.price &&
      activityData.price_range?.max &&
      activityData.price_range.min
    ) {
      throw new BadRequestError("Price and price range can't be both defined");
    }
    if (
      !activityData.price &&
      (!activityData.price_range ||
        !activityData.price_range.min ||
        !activityData.price_range.max)
    ) {
      throw new BadRequestError("You need one of them ");
    }
    const activity = await this.activityModel.create(activityData);

    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");

    if (activity == null) throw new NotFoundError("User not found");

    return new response(true, activity, "Activity", 201);
  };

  public getActivityByIDService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const activity = await this.activityModel.findById(new Types.ObjectId(id));
    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (activity == null) throw new NotFoundError("Activity not found");
    return new response(true, activity, "Activity is found", 200);
  };

  public getActivityByAdvertiserIDService = async (advertiserID: string) => {
    if (!Types.ObjectId.isValid(advertiserID)) {
      throw new BadRequestError("Invalid Adverstier ID format");
    }
    const activity = await this.activityModel.findOne({
      adverstier_id: new mongoose.Schema.Types.ObjectId(advertiserID),
    });
    if (activity instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (activity == null) {
      throw new NotFoundError("No Activity with this Adverstier ID");
    }
    return new response(true, activity, "Activity is found", 200);
  };

  public updateActivityService = async (
    id: string,
    activityData: IActivityDTO
  ) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const activity = await this.activityModel.findById(new Types.ObjectId(id));
    if (activity instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (activity == null) {
      throw new NotFoundError("No Activity with this ID");
    }
    const updateFields: Partial<IActivityDTO> = {};
    if (
      activityData.price &&
      activityData.price_range?.max &&
      activityData.price_range.min
    ) {
      throw new BadRequestError("Cannot enter both price and price range,choose one of them");
    }

    if (activityData.date) updateFields.date = activityData.date;
    if (activityData.time) updateFields.time = activityData.time;
    if (
      activityData.location &&
      activityData.location.latitude &&
      activityData.location.longitude
    ) {
      updateFields.location = activityData.location;
    }
    if (activityData.price !== undefined)
      updateFields.price = activityData.price;
    if (activityData.price_range)
      updateFields.price_range = {
        min: activityData.price_range.min,
        max: activityData.price_range.max,
      };
    if (activityData.category) updateFields.category = activityData.category;
    if (activityData.special_discount !== undefined)
      updateFields.special_discount = activityData.special_discount;
    if (activityData.tags) updateFields.tags = activityData.tags;
    if (activityData.booking_flag !== undefined)
      updateFields.booking_flag = activityData.booking_flag;
    if (updateFields.price !== undefined) {
      updateFields.price_range = { min: 0, max: 0 };
    } else if (
      updateFields.price_range?.min !== undefined &&
      updateFields.price_range?.max !== undefined
    ) {
      updateFields.price = 0;
    }

    const updatedActivity = await this.activityModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: updateFields },
      { new: true } // Returns the updated document
    );

    return new response(
      true,
      updatedActivity,
      "Activity is Update Successfully",
      200
    );
  };

  //Delete Actitivity
  public deleteActivityService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const activity = await this.activityModel.findByIdAndDelete(
      new Types.ObjectId(id)
    );
    if (activity instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (activity == null) {
      throw new NotFoundError("Activity not found");
    }
    return new response(true, null, "Activity deleted successfully", 200);
  };

  public async getActivitiesService(
    name: string,
    category: string,
    tag: string
  ) {
    // const newCategory = new Category({type:category});
    // await newCategory.save();
    // const newActivity = new Activity({
    //     category: newCategory._id,
    //     name: name,
    //     tags: [tag],
    // });
    // await newActivity.save();

    // console.log(newCategory);
    // console.log(newActivity);

    const newCategory = await new this.categoryModel({ type: category });
    await newCategory.save();
    const newActivity = await new this.activityModel({
      category: newCategory._id,
      name: name,
      tags: [tag],
      date: new Date(),
      price: 3000,
    });
    await newActivity.save();
    console.log(newCategory);
    console.log(newActivity);

    if (!name && !category && !tag) throw new BadRequestError("Invalid input");

    const activities = await this.activityModel
      .find({ name: name, tags: tag })
      .populate({ path: "category", match: { type: category } })
      .populate("comments")
      .populate({ path: "advertiser_id", select: "name" });

    if (activities instanceof Error)
      throw new InternalServerError("Internal server error");

    if (activities == null) throw new NotFoundError("Activities not found");

    if (activities.length == 0)
      throw new NotFoundError("No activities with this search data");

    return new response(true, activities, "Fetched activities", 200);
  }

  public async getUpcomingActivitiesService() {
    const today = Date.now();
    const activities = await this.activityModel
      .find({ date_time: { $gte: today } })
      .populate("category")
      .populate("comments")
      .populate({ path: "advertiser_id", select: "name" });

    if (activities instanceof Error)
      throw new InternalServerError("Internal server error");

    if (activities == null) throw new NotFoundError("Activities not found");

    if (activities.length == 0)
      throw new NotFoundError("No upcoming activities with searched data");

    return new response(true, activities, "Fetched upcoming activities", 200);
  }

  public async getFilteredActivitiesService(filters: {
    price?: { min?: number; max?: number };
    date?: { start?: Date; end?: Date };
    category?: string[];
    rating?: { min?: number; max?: number };
  }) {
    if (!filters) {
      const activities = await this.activityModel.find();
      return new response(
        true,
        activities,
        "All activities are fetched no filters applied",
        200
      );
    }
    const matchStage: any = {};

    if (filters.price) {
      if (filters.price.min !== undefined) {
        matchStage.price = { ...matchStage.price, $gte: filters.price.min };
      }
      if (filters.price.max !== undefined) {
        matchStage.price = { ...matchStage.price, $lte: filters.price.max };
      }
    }

    if (filters.date) {
      if (filters.date.start !== undefined) {
        matchStage.date = { ...matchStage.date, $gte: filters.date.start };
      }
      if (filters.date.end !== undefined) {
        matchStage.date = { ...matchStage.date, $lte: filters.date.end };
      }
    }

    if (filters.rating) {
      if (filters.rating.min !== undefined) {
        matchStage.average_rating = {
          ...matchStage.average_rating,
          $gte: filters.rating.min,
        };
      }
      if (filters.rating.max !== undefined) {
        matchStage.average_rating = {
          ...matchStage.average_rating,
          $lte: filters.rating.max,
        };
      }
    }

    var aggregationPipeline: any[] = [
      {
        $lookup: {
          from: "categories", // The name of the category collection
          localField: "category", // The field in the activities collection
          foreignField: "_id", // The field in the category collection
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $match: matchStage,
      },
    ];

    if (filters.category) {
      aggregationPipeline.push({
        $match: {
          "categoryDetails.type": { $in: filters.category },
        },
      });
    }
    console.log(aggregationPipeline);
    console.log(matchStage);
    const activities = await this.activityModel.aggregate(aggregationPipeline);
    if (activities instanceof Error)
      throw new InternalServerError("Internal server error");
    return new response(
      true,
      activities,
      "Filtered activities are fetched",
      200
    );
  }
}

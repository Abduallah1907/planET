import { IActivityDTO, UpdateIActivityDTO } from "@/interfaces/IActivity";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import mongoose, { Types } from "mongoose";
import { IFilterComponents } from "@/interfaces/IFilterComponents";
@Service()
export default class ActivityService {
  constructor(
    @Inject("activityModel") private activityModel: Models.ActivityModel,
    @Inject("categoryModel") private categoryModel: Models.CategoryModel
  ) {}

  public getAllActivitiesService = async () => {
    const activitiesData = await this.activityModel.find({});
    if (activitiesData instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (activitiesData == null) {
      throw new NotFoundError("No Activities Found");
    }

    const activities = activitiesData.map(activity => ({
      ...activity.toObject(),
      reviewsCount: activity.comments ? activity.comments.length : 0
    }));

    return new response(true, activities, "All activites are fetched", 200);
  };

  public async createActivityService(activityDatainput: IActivityDTO) {
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

    if (activity == null) throw new NotFoundError("activity not created");

    return new response(true, activity, "Activity", 201);
  }

  public async getActivityByIDService(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const activity = await this.activityModel.findById(new Types.ObjectId(id));
    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (activity == null) throw new NotFoundError("Activity not found");
    return new response(true, activity, "Activity is found", 200);
  }

  public async getActivityByAdvertiserIDService(advertiserID: string) {
    if (!Types.ObjectId.isValid(advertiserID)) {
      throw new BadRequestError("Invalid Adverstier ID format");
    }
    const activities = await this.activityModel.find({
      advertiser_id: advertiserID,
    });
    if (activities instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (activities == null) {
      throw new NotFoundError("No Activity with this Adverstier ID");
    }
    return new response(true, activities, "Activity is found", 200);
  }

  public async updateActivityService(
    id: string,
    activityData: UpdateIActivityDTO
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    if (
      activityData?.price &&
      activityData.price_range?.max &&
      activityData.price_range?.min
    ) {
      throw new BadRequestError(
        "Cannot enter both price and price range,choose one of them"
      );
    }
    const updatedActivity = await this.activityModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      activityData,
      { new: true }
    );
    if (updatedActivity instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (updatedActivity == null) {
      throw new NotFoundError("No Activity with this ID");
    }

    return new response(
      true,
      updatedActivity,
      "Activity is Updated Successfully",
      200
    );
  }

  //Delete Actitivity
  public async deleteActivityService(id: string) {
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
  }

  public async getActivityService(name: string, category: string, tag: string) {
    if (!name && !category && !tag) throw new BadRequestError("Invalid input");

    const searchCriteria: any = {};
    if (name) searchCriteria.name = name;
    if (tag) searchCriteria.tags = tag;

    const activities = await this.activityModel
      .find(searchCriteria)
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
  public async getSortedActivitiesService(sort: string, direction: string) {
    let sortCriteria = {};

    if (!sort && !direction) {
      const activities = await this.activityModel.find();
      return new response(
        true,
        activities,
        "Activities with no sort criteria provided",
        200
      );
    }
    if (sort === "price") {
      sortCriteria = { price: parseInt(direction) };
    } else if (sort === "ratings") {
      sortCriteria = { average_rating: parseInt(direction) };
    } else {
      throw new BadRequestError("Invalid sort criteria");
    }
    const activities = await this.activityModel.find().sort(sortCriteria);
    if (activities instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, activities, "Sorted activities are fetched", 200);
  }
  public async getFilterComponentsService() {
    const categories = await this.categoryModel.find().select("type").lean();

    const Dates = await this.activityModel
      .find()
      .sort({ date: 1 }) // Sort dates in ascending order
      .select("date") // Select only the date field
      .lean(); // Convert to plain JavaScript object

    const prices = await this.activityModel
      .find()
      .select("price")
      .sort({ price: 1 })
      .lean();

    const categoryTypes = categories.map((category) => category.type);

    const earliestDate = Dates[0].date;
    const latestDate = Dates[Dates.length - 1].date;

    const lowestPrice = prices[0]?.price ?? 0;
    const highestPrice = prices[prices.length - 1]?.price ?? 0;

    const filterComponents: IFilterComponents = {
      Category: {
        type: "multi-select",
        values: categoryTypes,
      },
      Date: {
        type: "date-range",
        start: earliestDate,
        end: latestDate,
      },
      Price: {
        type: "slider",
        min: lowestPrice,
        max: highestPrice,
      },
      Rating: {
        type: "slider",
        min: 0,
        max: 5,
      },
    };
    return new response(
      true,
      filterComponents,
      "Filter components fetched",
      200
    );
  }
}

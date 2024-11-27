import { IActivityDTO, UpdateIActivityDTO } from "@/interfaces/IActivity";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import response from "@/types/responses/response";
import Container, { Inject, Service } from "typedi";
import mongoose, { Types } from "mongoose";
import { IFilterComponents } from "@/interfaces/IFilterComponents";
import { ObjectId } from "mongodb";
import UserRoles from "@/types/enums/userRoles";
import User from "@/models/user";
import Notification from "@/models/Notification";
import Bookmark_Notify from "@/models/Bookmark_notify";
import NotificationService from "./notificationService";
@Service()
export default class ActivityService {
  constructor(
    @Inject("activityModel") private activityModel: Models.ActivityModel,
    @Inject("categoryModel") private categoryModel: Models.CategoryModel,
    @Inject("advertiserModel") private advertiserModel: Models.AdvertiserModel,
    @Inject("tagModel") private tagModel: Models.TagModel,
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel,
    @Inject("notificationModel")
    private notificationModel: Models.NotificationModel,
    @Inject("bookmark_notifyModel")
    private bookmark_notifyModel: Models.Bookmark_notifyModel,
    @Inject("touristModel") private touristModel: Models.TouristModel,
    @Inject("userModel") private userModel: Models.UserModel
  ) {}

  public async getAllActivitiesService(role: string) {
    const activityCriteria: any = {};
    if (role !== UserRoles.Admin) {
      activityCriteria.inappropriate_flag = false;
      activityCriteria.active_flag = true;
      activityCriteria.booking_flag = true;
    }

    const activitiesData = await this.activityModel
      .find(activityCriteria)
      .populate("category")
      .populate("tags")
      .populate({
        path: "advertiser_id",
        model: "Advertiser",
        populate: {
          path: "user_id",
          model: "User", // Ensure this matches the name of your user model
        },
      });

    if (activitiesData instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (activitiesData == null) {
      throw new NotFoundError("No Activities Found");
    }

    const activities = activitiesData.map((activity) => ({
      ...activity.toObject(),
      reviews_count: activity.comments ? activity.comments.length : 0,
    }));

    return new response(true, activities, "All activities are fetched", 200);
  }

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
      active_flag: activityDatainput.active_flag,
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
      throw new BadRequestError("You can only input price or price range");
    }
    const activity = await this.activityModel.create(activityData);
    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");

    if (activity == null) throw new NotFoundError("activity not created");
    const advertiser = await this.advertiserModel.findByIdAndUpdate(
      activityDatainput.advertiser_id,
      { $push: { activities: activity._id } },
      { new: true }
    );
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("Advertiser not found");

    return new response(true, activity, "Activity created successfully", 201);
  }

  public async getActivityByIDService(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const activity = await this.activityModel
      .findById(new Types.ObjectId(id))
      .populate("category")
      .populate("tags")
      .populate({
        path: "advertiser_id",
        model: "Advertiser",
        populate: {
          path: "user_id",
          model: "User", // Ensure this matches the name of your user model
        },
      });

    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (activity == null) throw new NotFoundError("Activity not found");

    return new response(true, activity, "Activity is found", 200);
  }

  public async getActivitiesByAdvertiserIDService(advertiserID: string) {
    if (!Types.ObjectId.isValid(advertiserID)) {
      throw new BadRequestError("Invalid Adverstier ID format");
    }
    const activitiesData = await this.activityModel
      .find({
        advertiser_id: advertiserID,
      })
      .populate("category")
      .populate("tags");
    if (activitiesData instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    const activities = activitiesData.map((activity) => ({
      ...activity.toObject(),
      reviews_count: activity.comments ? activity.comments.length : 0,
    }));
    return new response(true, activities, "Activities are found", 200);
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

    //check if the booking_flag is false and want to change it from body if I want to change it to true
    let sendmessage = false; //if the booking_flag is false and want to change it to true
    const activity = await this.activityModel.findById(new Types.ObjectId(id));
    if (activity == null) {
      throw new NotFoundError("Activity not found");
    }
    if (activity instanceof Error) {
      throw new InternalServerError("Internal server error");
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
    //check if the booking_flag is false and want to change it from body if I want to change it to true
    if (
      activity.booking_flag == false &&
      updatedActivity.booking_flag == true
    ) {
      //Add Notification and send Email
      //get all bookmarks for this activity
      const bookmarks = await this.bookmark_notifyModel.find({
        activity_id: new Types.ObjectId(id),
      });
      if (bookmarks instanceof Error) {
        throw new InternalServerError("Internal server error");
      }
      const notificationService = Container.get(NotificationService);

      //create notifications for each user
      for (const bookmark of bookmarks) {
        let message = `The activity ${updatedActivity.name} is now available for booking`;
        let notification = await notificationService.createNotificationService(
          bookmark.tourist_id,
          message,
          UserRoles.Tourist
        );
        if (notification instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (notification == null) {
          throw new NotFoundError("Notification not created");
        }
        //things before sending email
        let tourist = await this.touristModel.findById(bookmark.tourist_id);
        if (tourist instanceof Error) {
          throw new InternalServerError("Tourist Internal server error");
        }
        if (tourist == null) {
          throw new NotFoundError("Tourist not found");
        }
        let user = await this.userModel.findById(
          new Types.ObjectId((tourist as any).user_id)
        );
        if (user instanceof Error) {
          throw new InternalServerError("User Internal server error");
        }
        if (user == null) {
          throw new NotFoundError("User not found");
        }
        //send email
        const Title = "Activity is now available for booking";
        const mail = await notificationService.sendEmailNotificationService(
          Title,
          user.email,
          message
        );
        if (mail instanceof Error) {
          throw new InternalServerError("Internal server error");
        }
        if (mail == null) {
          throw new NotFoundError("Email not sent");
        }
      }
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
    const tickets = await this.ticketModel.find({ booking_id: id });
    const activityCheckDate = await this.activityModel.findById(id);
    if (activityCheckDate == null) {
      throw new NotFoundError("Activity not found");
    }

    if (activityCheckDate.date.getTime() >= Date.now() && tickets.length > 0) {
      throw new BadRequestError(
        "Activity is booked by some users so cannot delete and date is not passed"
      );
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
    const itineraries = await this.itineraryModel.find();
    for (const itinerary of itineraries) {
      const activityIndex = itinerary.activities.findIndex(
        (activityId) =>
          activityId.toString() === (activity!._id as Types.ObjectId).toString()
      );
      if (activityIndex !== -1) {
        itinerary.activities.splice(activityIndex, 1);
        await itinerary.save();
      }
    }
    await this.advertiserModel.findByIdAndUpdate(
      activity.advertiser_id,
      { $pull: { activities: activity._id } },
      { new: true }
    );
    return new response(true, activity, "Activity deleted successfully", 200);
  }

  public async getSearchActivityService(
    name: string,
    category: string,
    tag: string,
    role: string
  ) {
    if (!name && !category && !tag) throw new BadRequestError("Invalid input");

    const searchCriteria: any = {};
    if (name) searchCriteria.name = name;
    if (tag) searchCriteria.tags = tag;
    if (role !== UserRoles.Admin) {
      searchCriteria.inappropriate_flag = false;
      searchCriteria.active_flag = true;
      searchCriteria.booking_flag = true;
    }

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

  public async getUpcomingActivitiesService(role: string) {
    const today = Date.now();
    const activityCriteria: any = {};
    if (role !== UserRoles.Admin) {
      activityCriteria.inappropriate_flag = false;
      activityCriteria.active_flag = true;
      activityCriteria.booking_flag = true;
    }

    const activities = await this.activityModel
      .find(
        {
          date: { $gte: today },
        },
        activityCriteria
      )
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

  public async getFilteredActivitiesService(
    filters: {
      price?: { min?: number; max?: number };
      date?: { start?: string; end?: string };
      category?: string[];
      rating?: { min?: number; max?: number };
      preferences?: string[];
      advertiser_id?: string;
    },
    role: string
  ) {
    if (
      !filters ||
      Object.keys(filters).length === 0 ||
      (filters.advertiser_id && Object.keys(filters).length === 1)
    ) {
      const checks: any = {};
      if (filters.advertiser_id) {
        checks.advertiser_id = filters.advertiser_id;
      } else if (role !== UserRoles.Admin) {
        checks.booking_flag = true;
        checks.active_flag = true;
        checks.inappropriate_flag = false;
      }
      const activities = await this.activityModel.find(checks);
      return new response(
        true,
        activities,
        "All activities are fetched no filters applied",
        200
      );
    }
    const matchStage: any = {};
    if (filters.advertiser_id) {
      matchStage.advertiser_id = new ObjectId(filters.advertiser_id);
    } else if (role !== UserRoles.Admin) {
      matchStage.booking_flag = true;
      matchStage.active_flag = true;
      matchStage.inappropriate_flag = false;
    }

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
        const startDate = filters.date.start; // The input date is in day/month/year format
        const dashedStartDate = startDate.split("/").join("-");
        const filterStartDate = new Date(dashedStartDate);
        matchStage.date = {
          ...matchStage.date,
          $gte: filterStartDate,
        };
      }
      if (filters.date.end !== undefined) {
        const endDate = filters.date.end; // The input date is in day/month/year format
        const dashedEndDate = endDate.split("/").join("-");
        const filterEndDate = new Date(dashedEndDate);
        filterEndDate.setDate(filterEndDate.getDate() + 1);

        matchStage.date = {
          ...matchStage.date,
          $lte: filterEndDate,
        };
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

    var aggregationPipeline = [
      {
        $lookup: {
          from: "categories", // The name of the category collection
          localField: "category", // The field in the activities collection
          foreignField: "_id", // The field in the category collection
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "tags",
          let: { tagIds: "$tags" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$tagIds",
                        as: "tagId",
                        in: { $toObjectId: "$$tagId" },
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: "tags",
        },
      },
      {
        $addFields: {
          reviews_count: { $size: "$comments" },
        },
      },
      {
        $match: matchStage,
      },
    ];
    // Add conditional filters
    // console.log(JSON.stringify(aggregationPipeline));
    if (filters.category || filters.preferences) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { "category.type": { $in: filters.category || [] } },
            { "tags.type": { $in: filters.preferences || [] } },
          ],
        },
      });
    } else if (filters.category) {
      aggregationPipeline.push({
        $match: { "category.type": { $in: filters.category } },
      });
    } else if (filters.preferences) {
      aggregationPipeline.push({
        $match: { "tags.type": { $in: filters.preferences } },
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

  public async getSortedActivitiesService(
    sort: string,
    direction: string,
    role: string
  ) {
    let sortCriteria = {};
    const activityCriteria: any = {};
    if (role !== UserRoles.Admin) {
      activityCriteria.inappropriate_flag = false;
      activityCriteria.active_flag = true;
      activityCriteria.booking_flag = true;
    }
    if (!sort && !direction) {
      const activities = await this.activityModel.find(activityCriteria);
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

    const activities = await this.activityModel
      .find(activityCriteria)
      .sort(sortCriteria);
    if (activities instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, activities, "Sorted activities are fetched", 200);
  }
  public async getFilterComponentsService(role: string) {
    const categories = await this.categoryModel.find().select("type").lean();

    const preferences = await this.tagModel.find().select("type").lean();
    const activityCriteria: any = {};
    if (role !== UserRoles.Admin) {
      activityCriteria.inappropriate_flag = false;
      activityCriteria.active_flag = true;
      activityCriteria.booking_flag = true;
    }
    const Dates = await this.activityModel
      .find(activityCriteria)
      .sort({ date: 1 }) // Sort dates in ascending order
      .select("date") // Select only the date field
      .lean(); // Convert to plain JavaScript object

    const prices = await this.activityModel
      .find()
      .select("price")
      .sort({ price: 1 })
      .lean();

    const categoryTypes = categories.map((category) => category.type);

    const preferencesList = preferences.map(
      (preference: any) => preference.type
    );

    const earliestDate = Dates[0]?.date ?? Date.now();
    const latestDate = Dates[Dates.length - 1]?.date ?? Date.now();

    const lowestPrice = prices[0]?.price ?? 0;
    const highestPrice = prices[prices.length - 1]?.price ?? 0;

    const filterComponents: IFilterComponents = {
      Category: {
        type: "multi-select",
        values: categoryTypes,
      },
      Tag: { type: "multi-select", values: preferencesList },
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

  public async flagActivityInappropriateService(
    activity_id: Types.ObjectId
  ): Promise<response> {
    const activity = await this.activityModel.findById(activity_id);
    if (!activity) throw new NotFoundError("Activity not found");
    if (activity.inappropriate_flag === true)
      throw new ForbiddenError("Itinerary is already flagged");

    activity.inappropriate_flag = true;
    await activity.save();
    return new response(true, { activity_id }, "Activity flagged", 200);
  }
}

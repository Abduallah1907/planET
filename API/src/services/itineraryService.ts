import { IItineraryCreateDTO, IItineraryOutputAllDTO, IItineraryOutputDTO, IItineraryUpdateDTO } from "@/interfaces/IItinerary";
import { BadRequestError, ForbiddenError, HttpError, InternalServerError, NotFoundError, UnauthorizedError } from "@/types/Errors";
import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import mongoose, { ObjectId, Types } from "mongoose";
import { IFilterComponents } from "@/interfaces/IFilterComponents";
import path from "path";
import { ObjectId as MongoObjectID } from "mongodb";

@Service()
export default class ItineraryService {
  constructor(
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("tagModel") private tagModel: Models.TagModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel,
    @Inject("slotModel") private slotModel: Models.SlotModel
  ) {}
  // we also need timeline object???
  public async createItineraryService(itineraryData: IItineraryCreateDTO) {
    const tour_guide = await this.tourGuideModel.findById(itineraryData.tour_guide_id);

    const { slots, ...restData } = itineraryData;
    // Create new slots and get their ObjectIds
    const createdSlots = await this.slotModel.insertMany(slots);
    const slotIds = createdSlots.map((slot) => slot._id);

    const itineraryDataCreation = {
      ...restData,
      timeline: slotIds,
      comments: [],
      average_rating: 0,
      inappropriate_flag: false,
    };
    const newItinerary = await this.itineraryModel.create(itineraryDataCreation);

    if (newItinerary instanceof Error) throw new InternalServerError("Internal server error");

    tour_guide.itineraries.push(newItinerary._id);
    await tour_guide.save();

    return new response(true, { itinerary_id: newItinerary._id }, "Itinerary created successfully!", 201);
  }
  public async getItineraryByIDService(itinerary_id: Types.ObjectId) {
    const itineraryData = await this.itineraryModel
      .findById(itinerary_id)
      .populate("comments")
      .populate("tags")
      .populate("category")
      .populate("activities")
      .populate("timeline");
    if (itineraryData instanceof Error) throw new InternalServerError("Internal server error");
    if (!itineraryData) throw new HttpError("Itinerary not found", 404);

    const itineraryOutput: IItineraryOutputDTO = {
      // tour_guide_id: itineraryData.tour_guide_id,
      // activities: itineraryData.activities,
      // category: itineraryData.category,
      itinerary_id: itineraryData._id as ObjectId,
      name: itineraryData.name,
      accessibility: itineraryData.accessibility,
      active_flag: itineraryData.active_flag,
      inappropriate_flag: itineraryData.inappropriate_flag,
      available_dates: itineraryData.available_dates,
      reviews: itineraryData.comments,
      drop_off_loc: itineraryData.drop_off_loc,
      duration: itineraryData.duration,
      languages: itineraryData.languages,
      pickup_loc: itineraryData.pickup_loc,
      price: itineraryData.price,
      rating_value: itineraryData.average_rating,
      locations: itineraryData.locations,
      tags: itineraryData.tags,
    };
    return new response(true, itineraryData, "Itinerary found!", 201);
  }
  public async updateItineraryService(itinerary_id: Types.ObjectId, itineraryUpdatedData: IItineraryUpdateDTO) {
    // Find the itinerary by ID
    const itinerary = await this.itineraryModel.findById(itinerary_id);
    if (!itinerary) throw new NotFoundError("Itinerary not found");

    // Delete all slots with ObjectIds in itinerary.timeline
    await this.slotModel.deleteMany({ _id: { $in: itinerary.timeline } });

    // Extract slot data from itineraryUpdatedData
    const { slots, ...restUpdatedData } = itineraryUpdatedData;

    // Create new slots and get their ObjectIds
    const createdSlots = await this.slotModel.insertMany(slots);
    const slotIds = createdSlots.map((slot) => slot._id);

    // Update itineraryUpdatedData with the new timeline
    const updatedData = {
      ...restUpdatedData,
      timeline: slotIds,
    };

    const updatedItinerary = await this.itineraryModel.findByIdAndUpdate(itinerary_id, updatedData, { new: true });
    if (!updatedItinerary) throw new HttpError("Itinerary not found", 404);
    if (updatedItinerary instanceof Error) throw new InternalServerError("Internal server error");
    return new response(true, { itinerary_id: updatedItinerary._id }, "Itinerary updated!", 201);
  }
  public async deleteItineraryService(itinerary_id: Types.ObjectId) {
    const findTour_guide_id = await this.itineraryModel.findById(itinerary_id).select("tour_guide_id");
    if (!findTour_guide_id) throw new NotFoundError("Tour guide not found");

    const tourGuide = await this.tourGuideModel.findById(findTour_guide_id.tour_guide_id);
    if (!tourGuide) throw new HttpError("Tour guide not found", 404);

    const deletedItinerary = await this.itineraryModel.findByIdAndDelete(itinerary_id);
    if (!deletedItinerary) throw new HttpError("Itinerary not found", 404);

    tourGuide.itineraries.pull(itinerary_id);
    await tourGuide.save();

    return new response(true, { itinerary_id: deletedItinerary._id }, "Itinerary deleted!", 200);
  }

  public async deactivateItineraryService(itinerary_id: Types.ObjectId): Promise<any> {
    const itinerary = await this.itineraryModel.findById(itinerary_id);
    if (!itinerary) throw new NotFoundError("Itinerary not found! Did you enter the correct itinerary id?");
    if (itinerary.active_flag === false) throw new ForbiddenError("The itinerary is already deactived");

    itinerary.active_flag = false;
    await itinerary.save();

    return new response(true, { itinerary_id: itinerary_id }, "Itinerary deactivated", 200);
  }

  public async activateItineraryService(itinerary_id: Types.ObjectId): Promise<any> {
    const itinerary = await this.itineraryModel.findById(itinerary_id);
    if (!itinerary) throw new NotFoundError("Itinerary not found! Did you enter the correct itinerary id?");

    if (itinerary.active_flag === true) throw new ForbiddenError("The itinerary is already active");
    // we check if there's bookings, since, the excel mentions that "itineraries with bookings can only be deactivated"
    // need to double check with the ta on this info, but if it is true then the user must be warned with this information too

    const itineraryBooked = await this.ticketModel.find({ booking_id: itinerary_id });
    if (itineraryBooked) throw new ForbiddenError("If the itinerary is booked, we cannot activate the itinerary");

    itinerary.active_flag = true;
    await itinerary.save();

    return new response(true, { itinerary_id: itinerary_id }, "Itinerary activated", 200);
  }

  public async flagItineraryInappropriateService(itinerary_id: Types.ObjectId): Promise<any> {
    const itinerary = await this.itineraryModel.findById(itinerary_id);
    if (!itinerary) throw new NotFoundError("Itinerary not found");
    if (itinerary.inappropriate_flag === true) throw new ForbiddenError("Itinerary is already flagged");

    itinerary.inappropriate_flag = true;
    await itinerary.save();
    return new response(true, { itinerary_id: itinerary_id }, "Itinerary flagged", 200);
  }

  // view all itineraries
  public async getAllItinerariesByTourGuideIDService(tour_guide_id: string) {
    if (!Types.ObjectId.isValid(tour_guide_id)) {
      throw new BadRequestError("Invalid Tour Guide ID format");
    }
    const { itineraries } = await this.tourGuideModel.findById(tour_guide_id).populate({
      path: "itineraries",
      populate: [{ path: "tags" }, { path: "category" }],
    });
    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");

    const itinerariesOutput: IItineraryOutputDTO[] = itineraries.map((itinearary: any) => ({
      ...itinearary.toObject(),
      reviews_count: itinearary.comments ? itinearary.comments.length : 0,
    }));
    return new response(true, itinerariesOutput, "Returning all found itineraries!", 200);
  }

  public async getAllItinerariesService(page: number): Promise<any> {
    const itineraries = await this.itineraryModel
      .find({ active_flag: true, inappropriate_flag: false })
      .limit(10)
      .populate("comments")
      .populate("tags")
      .skip((page - 1) * 10);
    if (itineraries instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    const itinerartiesOutput: IItineraryOutputAllDTO[] = itineraries.map((itinerary) => ({
      itinerary_id: itinerary._id as ObjectId,
      name: itinerary.name,
      accessibility: itinerary.accessibility,
      active_flag: itinerary.active_flag,
      inappropriate_flag: itinerary.inappropriate_flag,
      available_dates: itinerary.available_dates,
      reviews: itinerary.comments,
      drop_off_loc: itinerary.drop_off_loc,
      duration: itinerary.duration,
      languages: itinerary.languages,
      pickup_loc: itinerary.pickup_loc,
      price: itinerary.price,
      average_rating: itinerary.average_rating,
      locations: itinerary.locations,
      tags: itinerary.tags,
      reviews_count: itinerary.comments.length,
    }));

    return new response(true, itinerartiesOutput, "Page " + page + " of itineraries", 200);
  }

  public async getSearchItineraryService(name: string, category: string, tag: string) {
    if (!name && !category && !tag) throw new BadRequestError("Invalid input");

    const itineraries = await this.itineraryModel
      .find({ name: name, tags: tag, active_flag: true, inappropriate_flag: false })
      .populate({ path: "category", match: { type: category } })
      .populate("timeline")
      .populate("activities")
      .populate({ path: "tour_guide_id", select: "name" });
    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");

    if (itineraries == null) throw new NotFoundError("Itineraries not found");

    if (itineraries.length == 0) throw new NotFoundError("No Itineraries with this search data");

    return new response(true, itineraries, "Fetched itineraries", 200);
  }

  public async getUpcomingItinerariesService() {
    const today = Date.now();
    const itineraries = await this.itineraryModel
      .find({ available_dates: { $gte: today }, active_flag: true, inappropriate_flag: false })
      .populate("category")
      .populate("timeline")
      .populate("activities")
      .populate({ path: "tour_guide_id", select: "name" });

    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");

    if (itineraries == null) throw new NotFoundError("Itineraries not found");

    if (itineraries.length == 0) throw new NotFoundError("No upcoming itineraries with searched data");

    return new response(true, itineraries, "Fetched upcoming itineraries", 200);
  }
  public async getFilteredItinerariesService(filters: {
    price?: { min?: number; max?: number };
    date?: { start?: Date; end?: Date };
    preferences?: string[];
    languages?: string[];
    tour_guide_id?: string;
  }) {
    if (!filters || Object.keys(filters).length === 0 || (filters.tour_guide_id && Object.keys(filters).length === 1)) {
      const checks: any = {};
      if (filters.tour_guide_id) {
        checks.tour_guide_id = filters.tour_guide_id;
      } else {
        checks.active_flag = true;
        checks.inappropriate_flag = false;
      }
      const itineraries = await this.itineraryModel.find(checks);
      return new response(true, itineraries, "All itineraries are fetched no filter applied", 200);
    }
    const matchStage: any = {};
    if (filters.tour_guide_id) {
      matchStage.tour_guide_id = new MongoObjectID(filters.tour_guide_id);
    } else {
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
      if (filters.date.start !== undefined && filters.date.end !== undefined) {
        matchStage.available_dates = {
          $elemMatch: {
            $gte: new Date(filters.date.start),
            $lte: new Date(filters.date.end),
          },
        };
      } else if (filters.date.start !== undefined) {
        matchStage.available_dates = {
          $elemMatch: {
            $gte: new Date(filters.date.start),
          },
        };
      } else if (filters.date.end !== undefined) {
        matchStage.available_dates = {
          $elemMatch: {
            $lte: new Date(filters.date.end),
          },
        };
      }
    }

    if (filters.languages) {
      matchStage.languages = { $in: filters.languages };
    }

    var aggregationPipeline: any[] = [
      {
        $lookup: {
          from: "tags", // The name of the tag collection
          localField: "tags", // The field in the tags collection
          foreignField: "_id", // The field in the tags collection
          as: "tags",
        },
      },
      {
        $match: matchStage,
      },
      {
        $addFields: {
          reviews_count: { $size: "$comments" },
        },
      },
    ];
    if (filters.preferences) {
      aggregationPipeline.push({
        $match: {
          "tags.type": { $in: filters.preferences },
        },
      });
    }
    const itineraries = await this.itineraryModel.aggregate(aggregationPipeline);
    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");
    return new response(true, itineraries, "Filtered itineraries are fetched", 200);
  }
  public async getSortedItinerariesService(sort: string, direction: string) {
    let sortCriteria = {};
    if (!sort && !direction) {
      const itineraries = await this.itineraryModel.find({ active_flag: true, inappropriate_flag: false });
      return new response(true, itineraries, "Itineraries with no sort criteria provided", 200);
    }

    if (sort === "price") {
      sortCriteria = { price: parseInt(direction) };
    } else if (sort === "ratings") {
      sortCriteria = { average_rating: parseInt(direction) };
    } else {
      throw new BadRequestError("Invalid sort criteria");
    }

    const itineraries = await this.itineraryModel.find({ active_flag: true, inappropriate_flag: false }).sort(sortCriteria);
    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");

    return new response(true, itineraries, "Sorted activities are fetched", 200);
  }
  public async getFilterComponentsService() {
    const preferences = await this.tagModel.find().select("type").lean();

    const prices = await this.itineraryModel.find({ active_flag: true, inappropriate_flag: false }).select("price").sort({ price: 1 }).lean();

    const dates = await this.itineraryModel.find({ active_flag: true, inappropriate_flag: false }).select("available_dates").lean();

    const allDates = dates.flatMap((itinerary: any) => itinerary.available_dates);
    allDates.sort((a: Date, b: Date) => a.getTime() - b.getTime());

    const languages = await this.itineraryModel.find({ active_flag: true, inappropriate_flag: false }).select("languages").lean();

    const preferencesList = preferences.map((preference: any) => preference.type);

    const lowestPrice = prices[0].price;
    const highestPrice = prices[prices.length - 1].price;

    const earliestDate = allDates[0];
    const latestDate = allDates[allDates.length - 1];

    const languagesList = [...new Set(languages.flatMap((language: any) => language.languages))];

    const filterComponents: IFilterComponents = {
      Tag: { type: "multi-select", values: preferencesList },

      Language: { type: "multi-select", values: languagesList },

      Price: { type: "slider", min: lowestPrice, max: highestPrice },

      Date: { type: "date-range", start: earliestDate, end: latestDate },
    };
    return new response(true, filterComponents, "Filter components fetched", 200);
  }
}

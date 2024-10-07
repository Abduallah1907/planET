import { IItineraryCreateDTO, IItineraryOutputAllDTO, IItineraryOutputDTO, IItineraryUpdateDTO } from "@/interfaces/IItinerary";
import { BadRequestError, HttpError, InternalServerError, NotFoundError } from "@/types/Errors";
import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import { ObjectId, Types } from "mongoose";

@Service()
export default class ItineraryService {
  constructor(
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel
  ) {}
  // we also need timeline object???
  public async createItineraryService(itineraryData: IItineraryCreateDTO) {
    const tour_guide = await this.tourGuideModel.findById(itineraryData.tour_guide_id);
    const itineraryDataCreation = {
      ...itineraryData,
      comments: [],
      active_flag: true,
      inappropriate_flag: false,
    };
    const newItinerary = await this.itineraryModel.create(itineraryDataCreation);

    if (newItinerary instanceof Error) throw new InternalServerError("Internal server error");

    tour_guide.itineraries.push(newItinerary._id);
    await tour_guide.save();

    return new response(true, { itinerary_id: newItinerary._id }, "Itinerary created successfully!", 201);
  }
  public async getItineraryByIDService(itinerary_id: Types.ObjectId) {
    const itineraryData = await this.itineraryModel.findById(itinerary_id);
    if (itineraryData instanceof Error) throw new InternalServerError("Internal server error");
    if (!itineraryData) throw new HttpError("Itinerary not found", 404);

    const itineraryOutput: IItineraryOutputDTO = {
      itinerary_id: itineraryData._id,
      tour_guide_id: itineraryData.tour_guide_id,
      name: itineraryData.name,
      activities: itineraryData.activities,
      category: itineraryData.category,
      tags: itineraryData.tags,
      available_dates: itineraryData.available_dates,
      comments: itineraryData.comments,
      drop_off_loc: itineraryData.drop_off_loc,
      languages: itineraryData.languages,
      locations: itineraryData.locations,
      pickup_loc: itineraryData.pickup_loc,
      timeline: itineraryData.timeline,
    };
    return new response(true, itineraryOutput, "Itinerary found!", 201);
  }
  public async updateItineraryService(itinerary_id: Types.ObjectId, itineraryUpdatedData: IItineraryUpdateDTO) {
    const updatedItinerary = await this.itineraryModel.findByIdAndUpdate(itinerary_id, itineraryUpdatedData, { new: true });
    if (!updatedItinerary) throw new HttpError("Itinerary not found", 404);
    if (updatedItinerary instanceof Error) throw new InternalServerError("Internal server error");
    return new response(true, { itinerary_id: updatedItinerary._id }, "Itinerary updated!", 201);
  }
  public async deleteItineraryService(itinerary_id: Types.ObjectId) {
    const findTour_guide_id = await this.itineraryModel.findById(itinerary_id).select("tour_guide_id");
    console.log(findTour_guide_id);
    if (!findTour_guide_id) throw new NotFoundError("Tour guide not found");

    const tourGuide = await this.tourGuideModel.findById(findTour_guide_id.tour_guide_id);
    console.log(tourGuide);
    if (!tourGuide) throw new HttpError("Tour guide not found", 404);

    const deletedItinerary = await this.itineraryModel.findByIdAndDelete(itinerary_id);
    if (!deletedItinerary) throw new HttpError("Itinerary not found", 404);

    tourGuide.itineraries.pull(itinerary_id);
    await tourGuide.save();

    return new response(true, { itinerary_id: deletedItinerary._id }, "Itinerary deleted!", 200);
  }

  // view all itineraries
  public async getAllItinerariesByTourGuideIDService(tour_guide_id: Types.ObjectId) {
    // why not use DTO for output one might ask
    // it is because i do not want to write all the attributes thanks
    // this also leaves activities' subdocuments as is, if the front end needs that info i will fix it
    // otherwise everything is fine
    const { itineraries } = await this.tourGuideModel.findById(tour_guide_id).populate({
      path: "itineraries",
      populate: [{ path: "activities" }, { path: "comments" }, { path: "category" }],
    });
    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");
    if (!itineraries) throw new HttpError("Tour guide not found", 404);
    const itinerariesOutput: IItineraryOutputDTO[] = itineraries.map((itinearary: {}) => ({}));
    return new response(true, itineraries, "Returning all found itineraries!", 201);
  }

  public async getAllItineraries(page: number): Promise<any> {
    const itineraries = await this.itineraryModel
      .find({})
      .limit(10)
      .populate("comments")
      .skip((page - 1) * 10);
    if (itineraries instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    console.log(itineraries);

    let itinerartiesOutput: IItineraryOutputAllDTO[] = itineraries.map((itinerary) => ({
      itinerary_id: itinerary._id,
      accessibility: itinerary.accessibility,
      active_flag: itinerary.active_flag,
      available_dates: itinerary.available_dates,
      reviews: itinerary.comments,
      drop_off_loc: itinerary.drop_off_loc,
      duration: itinerary.duration,
      languages: itinerary.languages,
      pickup_loc: itinerary.pickup_loc,
      price: itinerary.price,
      rating_value: itinerary.average_rating,
      locations: itinerary.locations,
    }));

    return new response(true, itinerartiesOutput, "Page " + page + " of itineraries", 200);
  }

  public async getSearchItineraryService(name: string, category: string, tag: string) {
    if (!name && !category && !tag) throw new BadRequestError("Invalid input");

    const itineraries = await this.itineraryModel
      .find({ name: name, tags: tag })
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
      .find({ available_dates: { $gte: today } })
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
  }) {
    if (!filters) {
      const itineraries = await this.itineraryModel.find();
      return new response(true, itineraries, "All itineraries are fetched no filter applied", 200);
    }
    const matchStage: any = {};
    matchStage.active_flag = true;
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
    var aggregationPipeline: any[] = [
      {
        $lookup: {
          from: "tags", // The name of the tag collection
          localField: "tags", // The field in the tags collection
          foreignField: "_id", // The field in the tags collection
          as: "tagDetails",
        },
      },
      {
        $unwind: "$tagDetails",
      },
      {
        $match: matchStage,
      },
    ];
    if (filters.preferences) {
      aggregationPipeline.push({
        $match: {
          "tagDetails.type": { $in: filters.preferences },
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
      const itineraries = await this.itineraryModel.find();
      return new response(true, itineraries, "Itineraries with no sort criteria provided", 200);
    }

    if (sort === "price") {
      sortCriteria = { price: parseInt(direction) };
    } else if (sort === "ratings") {
      sortCriteria = { average_rating: parseInt(direction) };
    } else {
      throw new BadRequestError("Invalid sort criteria");
    }

    const itineraries = await this.itineraryModel.find().sort(sortCriteria);
    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");

    return new response(true, itineraries, "Sorted activities are fetched", 200);
  }
}

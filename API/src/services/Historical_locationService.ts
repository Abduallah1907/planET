import { BadRequestError, InternalServerError, NotFoundError } from "@/types/Errors";

import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import { Types } from "mongoose";
import { IHistorical_locationDTO, IHistorical_locationOutputDTO, Update_IHistorical_locationDTO } from "@/interfaces/IHistorical_Location";
import { IFilterComponents } from "@/interfaces/IFilterComponents";
import { ObjectId as MongoObjectID } from "mongodb";
import UserRoles from "@/types/enums/userRoles";
@Service()
export default class Historical_locationService {
  constructor(
    @Inject("historical_locationModel")
    private historical_locationsModel: Models.Historical_locationsModel,
    @Inject("historical_tagModel")
    private historical_tagModel: Models.Historical_tagModel,
    @Inject("governorModel") private governorModel: Models.GovernorModel
  ) {}
  //this function is to choose the price based on the user data
  public choosePrice = async (location: any, data: { job: string; nation: string }) => {
    if (data.job == null || data.job == undefined || data.job == "" || data.nation == null || data.nation == undefined || data.nation == "") {
      return location.foreign_price;
    }
    if (data.job.toLowerCase() == "student") {
      return location.student_price;
    } else {
      const governor = await this.governorModel.findById(location.governor_id);
      if (governor?.nation.toLowerCase() == data.nation.toLowerCase()) {
        return location.native_price;
      } else {
        return location.foreign_price;
      }
    }
  };

  //this a function to check if the value corresponds to the key in the object
  private checkIfValueIsRIght = async (Data: Map<string, string>) => {
    // we want to get the corresponding value of the key in historical_tag
    if (Data == null || Data.size == 0 || Data == undefined) {
      return true;
    }
    for (const [key, value] of Data) {
      if (!Types.ObjectId.isValid(key)) {
        throw new BadRequestError("Invalid ID format");
      }
      if (typeof value !== "string") {
        throw new BadRequestError("Invalid value format");
      }
      const historical_tag = await this.historical_tagModel
        .findOne({
          _id: new Types.ObjectId(key),
        })
        .exec();
      if (historical_tag instanceof Error) {
        throw new InternalServerError("Internal server error");
      }
      if (historical_tag == null) {
        throw new NotFoundError("Tag not found");
      }
      //We got the corresponding key to historical_tag
      //We want to see if the value is in the historical_tag value array
      if (!historical_tag.values.includes(value)) {
        throw new BadRequestError("Value is not in the tag,choose corresponding Value to the tag");
      }
      return true;
    }
  };
  public getAllHistorical_locationsService = async (data: any, role: string) => {
    const historicalCriteria: any = {};
    if (role !== UserRoles.Admin) {
      historicalCriteria.active_flag = true;
    }
    const Historical_location = await this.historical_locationsModel.find(historicalCriteria);
    if (Historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_location == null) {
      throw new NotFoundError("No Historical_locations Found");
    }

    const historical_locationsOutput = await Promise.all(
      Historical_location.map(async (locationi) => ({
        _id: locationi._id,
        name: locationi.name,
        location: locationi.location,
        average_rating: locationi.average_rating,
        comments: locationi.comments,
        price: await this.choosePrice(locationi, data), //this function is to choose the price based on the user data
        opening_hours_from: locationi.opening_hours_from,
        opening_hours_to: locationi.opening_hours_to,
        opening_days: locationi.opening_days,
        description: locationi.description,
        active_flag: locationi.active_flag,
        images: locationi.images,
        tags: locationi.tags,
        reviewsCount: locationi.comments.length,
        category: locationi.category,
      }))
    );
    return new response(true, historical_locationsOutput, "All historical Locations are fetched", 200);
  };
  public createHistorical_locationService = async (historical_locationInput: IHistorical_locationDTO) => {
    const historical_locationData: IHistorical_locationDTO = {
      name: historical_locationInput.name,
      governor_id: historical_locationInput.governor_id,
      description: historical_locationInput.description,
      images: historical_locationInput.images,
      location: historical_locationInput.location,
      opening_days: historical_locationInput.opening_days,
      opening_hours_from: historical_locationInput.opening_hours_from,
      opening_hours_to: historical_locationInput.opening_hours_to,
      native_price: historical_locationInput.native_price,
      foreign_price: historical_locationInput.foreign_price,
      category: historical_locationInput.category,
      student_price: historical_locationInput.student_price,
      tags: historical_locationInput.tags,
      active_flag: historical_locationInput.active_flag ? historical_locationInput.active_flag : true,
    };
    //Code to check if the value corresponds to the key in the object
    const tags_keys = historical_locationData.tags ? new Map(Object.entries(historical_locationData.tags)) : new Map();
    if (!(tags_keys instanceof Map || tags_keys == null)) {
      throw new BadRequestError("Tags should be an object of map key-value pairs");
    }
    if ((tags_keys && tags_keys.size > 0) || tags_keys == null || tags_keys == undefined) {
      const usetags = await this.checkIfValueIsRIght(tags_keys);
      if (usetags) {
        historical_locationData.tags = tags_keys;
      }
    }
    // end of code to check if the value corresponds to the key in the object
    const historical_location = await this.historical_locationsModel.create(historical_locationData);
    if (historical_location instanceof Error) throw new InternalServerError("Internal server error");

    if (historical_location == null) throw new NotFoundError("Cannot be created");

    const Governor = await this.governorModel.findByIdAndUpdate(
      historical_locationInput.governor_id,
      { $push: { historical_locations: historical_location._id } },
      { new: true }
    );
    if (Governor instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Governor == null) {
      throw new NotFoundError("Governer not found");
    }

    return new response(true, historical_location, "Historical location created", 201);
  };

  public getHistorical_locationByIDService = async (data: any) => {
    if (!Types.ObjectId.isValid(data.historical_location_id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location = await this.historical_locationsModel.findById(new Types.ObjectId(data.historical_location_id));
    if (Historical_location instanceof Error) throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (Historical_location == null) throw new NotFoundError("Historical Location not found");

    const historical_locationOutput = {
      _id: Historical_location._id,
      name: Historical_location.name,
      location: Historical_location.location,
      average_rating: Historical_location.average_rating,
      comments: Historical_location.comments,
      price: await this.choosePrice(Historical_location, data), //this function is to choose the price based on the user data
      opening_hours_from: Historical_location.opening_hours_from,
      opening_hours_to: Historical_location.opening_hours_to,
      opening_days: Historical_location.opening_days,
      description: Historical_location.description,
      active_flag: Historical_location.active_flag,
      images: Historical_location.images,
      tags: Historical_location.tags,
      reviewsCount: Historical_location.comments.length,
    };
    return new response(true, historical_locationOutput, "Historical Location is found", 200);
  };

  public getHistorical_locationByIDForGovernerService = async (data: any) => {
    if (!Types.ObjectId.isValid(data.historical_location_id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location = await this.historical_locationsModel.findById(new Types.ObjectId(data.historical_location_id));
    if (Historical_location instanceof Error) throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    return new response(true, Historical_location, "Historical Location is found", 200);
  };

  //Get Historical_location by Governer_id
  public getHistorical_locationsByGovernerIDService = async (Governer_id: string) => {
    if (!Types.ObjectId.isValid(Governer_id)) {
      throw new BadRequestError("Invalid Governer ID format");
    }
    const Historical_locations = await this.historical_locationsModel.find({
      governor_id: new Types.ObjectId(Governer_id),
    });
    if (Historical_locations instanceof Error) throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (Historical_locations == null) throw new NotFoundError("Historical Location not found");
    return new response(true, Historical_locations, "Historical Location is found", 200);
  };
  //Update Historical_location
  public updateHistorical_locationService = async (historical_location_id: string, updated_historical_location: Update_IHistorical_locationDTO) => {
    if (!Types.ObjectId.isValid(historical_location_id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location = await this.historical_locationsModel.findById(new Types.ObjectId(historical_location_id));
    if (Historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_location == null) {
      throw new NotFoundError("Historical Location not found");
    }

    //Code to check if the value corresponds to the key in the object
    const tags_keys = updated_historical_location.tags ? new Map(Object.entries(updated_historical_location.tags)) : new Map();
    if (!(tags_keys instanceof Map || tags_keys == null)) {
      throw new BadRequestError("Tags should be an object of map key-value pairs");
    }
    if ((tags_keys && tags_keys.size > 0) || tags_keys == null || tags_keys == undefined) {
      const usetags = await this.checkIfValueIsRIght(tags_keys);
      if (usetags) {
        updated_historical_location.tags = tags_keys;
      }
    }
    // end of code to check if the value corresponds to the key in the object
    const Updated_historical_location_response = await this.historical_locationsModel.findByIdAndUpdate(
      new Types.ObjectId(historical_location_id),
      updated_historical_location,
      { new: true } // Returns the updated document
    );
    if (Updated_historical_location_response instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Updated_historical_location_response == null) {
      throw new NotFoundError("Historical Location not found");
    }
    return new response(true, Updated_historical_location_response, "Historical Location is updated", 200);
  };
  //Delete Historical_location
  public async deleteHistorical_locationService(historical_location_id: Types.ObjectId) {
    if (!Types.ObjectId.isValid(historical_location_id)) {
      throw new BadRequestError("Invalid historical location ID format");
    }
    const Historical_location = await this.historical_locationsModel.findByIdAndDelete(historical_location_id);
    if (Historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_location == null) {
      throw new NotFoundError("Historical Location not found");
    }

    const Governor = await this.governorModel.findOneAndUpdate(
      { historical_locations: historical_location_id },
      { $pull: { historical_locations: historical_location_id } },
      { new: true }
    );
    if (Governor instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Governor == null) {
      throw new NotFoundError("Governer not found");
    }
    return new response(true, Historical_location, "Historical Location is deleted", 200);
  }

  public async getSearchHistorical_locationService(name: string, category: string, tag: string, role: string) {
    if (!name && !category && !tag) throw new BadRequestError("Invalid input");
    const historicalCriteria: any = {};
    if (role !== UserRoles.Admin) {
      historicalCriteria.active_flag = true;
    }

    const historical_locations = await this.historical_locationsModel
      .find({ name: name, tags: tag }, historicalCriteria)
      .populate({ path: "category", match: { type: category } })
      .populate("comments")
      .populate({ path: "governor_id", select: "name" });
    if (historical_locations instanceof Error) throw new InternalServerError("Internal server error");

    if (historical_locations == null) throw new NotFoundError("Historical locations not found");

    if (historical_locations.length == 0) throw new NotFoundError("No Historical locations with this search data");

    return new response(true, historical_locations, "Fetched historical locations", 200);
  }

  public async getUpcomingHistorical_locationsService(role: string) {
    const historicalCriteria: any = {};
    if (role !== UserRoles.Admin) {
      historicalCriteria.active_flag = true;
    }
    const today = Date.now();
    const historical_locations = await this.historical_locationsModel
      .find({ date_time: { $gte: today } }, historicalCriteria)
      .populate("category")
      .populate("comments")
      .populate({ path: "governor_id", select: "name" });

    if (historical_locations instanceof Error) throw new InternalServerError("Internal server error");

    if (historical_locations == null) throw new NotFoundError("Historical locations not found");

    if (historical_locations.length == 0) throw new NotFoundError("No upcoming historical locations with searched data");
    return new response(true, historical_locations, "Fetched upcoming historical locations", 200);
  }
  public async getFilteredHistorical_locationsService(filters: { tags?: string[]; nation: string; job: string; governor_id?: string }, role: string) {
    if (!filters || Object.keys(filters).length === 0 || (filters.governor_id && Object.keys(filters).length === 1)) {
      const checks: any = {};
      if (filters.governor_id) {
        checks.governor_id = filters.governor_id;
      } else if (role !== UserRoles.Admin) {
        checks.active_flag = true;
      }
      const historical_locations = await this.historical_locationsModel.find(checks);
      return new response(true, historical_locations, "All historical locations are fetched no filter applied", 200);
    }
    const matchStage: any = {};
    if (filters.governor_id) {
      matchStage.governor_id = new MongoObjectID(filters.governor_id);
    } else if (role !== UserRoles.Admin) {
      matchStage.active_flag = true;
    }
    var aggregationPipeline: any[] = [
      {
        $addFields: {
          tagsArray: { $objectToArray: "$tags" },
        },
      },
      {
        $match: matchStage,
      },
    ];
    if (filters.tags) {
      aggregationPipeline.push({
        $match: {
          "tagsArray.v": { $in: filters.tags },
        },
      });
    }
    const historical_locations = await this.historical_locationsModel.aggregate(aggregationPipeline);
    if (historical_locations instanceof Error) throw new InternalServerError("Internal server error");

    if (!filters.governor_id) {
      const historical_locations_with_prices = await Promise.all(
        historical_locations.map(async (location) => {
          location.price = await this.choosePrice(location, {
            nation: filters.nation,
            job: filters.job,
          });
          return location;
        })
      );
      return new response(true, historical_locations_with_prices, "Filtered itineraries are fetched", 200);
    } else {
      return new response(true, historical_locations, "Filtered itineraries are fetched", 200);
    }
  }

  public async getFilterComponentsService(role: string) {
    const historicalCriteria: any = {};
    if (role !== UserRoles.Admin) {
      historicalCriteria.active_flag = true;
    }
    const historicalLocations = await this.historical_locationsModel.find(historicalCriteria).select("tags").lean();

    // Extract and aggregate tags
    const tagsSet = new Set<string>();
    historicalLocations.forEach((location: any) => {
      if (location.tags) {
        Object.values(location.tags).forEach((tag) => tagsSet.add(tag as string));
      }
    });

    const tagsList = Array.from(tagsSet);

    const filterComponents: IFilterComponents = {
      Tag: { type: "multi-select", values: tagsList },
      // Add other filter components as needed
    };

    return new response(true, filterComponents, "Filter components fetched", 200);
  }
}

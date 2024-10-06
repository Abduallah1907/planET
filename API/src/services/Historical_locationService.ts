import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";

import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import mongoose, { Types } from "mongoose";
import {
  IHistorical_locationDTO,
  Update_IHistorical_locationDTO,
} from "@/interfaces/IHistorical_Location";
import Governor from "@/models/Governor";
import historical_location from "@/api/routes/historical_location";
@Service()
export default class Historical_locationService {
  constructor(
    @Inject("historical_locationModel")
    private historical_locationsModel: Models.Historical_locationsModel,
    @Inject("historical_tagModel")
    private historical_tagModel: Models.Historical_tagModel,
    @Inject("governorModel") private governorModel: Models.GovernorModel
  ) {}

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
      if (!historical_tag.Values.includes(value)) {
        throw new BadRequestError(
          "Value is not in the tag,choose corresponding Value to the tag"
        );
      }
      return true;
    }
  };
  public getAllHistorical_locationsService = async () => {
    const Historical_location = await this.historical_locationsModel.find({});
    if (Historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_location == null) {
      throw new NotFoundError("No Historical_locations Found");
    }
    return new response(
      true,
      Historical_location,
      "All historical Locations are fetched",
      200
    );
  };
  public createHistorical_locationService = async (
    historical_locationInput: IHistorical_locationDTO
  ) => {
    const historical_locationData: IHistorical_locationDTO = {
      name: historical_locationInput.name,
      governor_id: historical_locationInput.governor_id,
      description: historical_locationInput.description,
      picture: historical_locationInput.picture,
      location: historical_locationInput.location,
      opening_hours_from: historical_locationInput.opening_hours_from,
      opening_hours_to: historical_locationInput.opening_hours_to,
      native_price: historical_locationInput.native_price,
      foreign_price: historical_locationInput.foreign_price,
      student_price: historical_locationInput.student_price,
      tags: historical_locationInput.tags,
    };
    //Code to check if the value corresponds to the key in the object
    const tags_keys = historical_locationData.tags
      ? new Map(Object.entries(historical_locationData.tags))
      : new Map();
    if (!(tags_keys instanceof Map || tags_keys == null)) {
      throw new BadRequestError(
        "Tags should be an object of map key-value pairs"
      );
    }
    if (
      (tags_keys && tags_keys.size > 0) ||
      tags_keys == null ||
      tags_keys == undefined
    ) {
      const usetags = await this.checkIfValueIsRIght(tags_keys);
      if (usetags) {
        historical_locationData.tags = tags_keys;
      }
    }
    // end of code to check if the value corresponds to the key in the object
    const historical_location = await this.historical_locationsModel.create(
      historical_locationData
    );
    if (historical_location instanceof Error)
      throw new InternalServerError("Internal server error");

    if (historical_location == null)
      throw new NotFoundError("Cannot be created");

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

    return new response(
      true,
      historical_location,
      "Historical location created",
      201
    );
  };

  public getHistorical_locationByIDService = async (
    historical_location_id: string
  ) => {
    if (!Types.ObjectId.isValid(historical_location_id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location = await this.historical_locationsModel.findById(
      new Types.ObjectId(historical_location_id)
    );
    if (Historical_location instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (Historical_location == null)
      throw new NotFoundError("Historical Location not found");
    return new response(
      true,
      Historical_location,
      "Historical Location is found",
      200
    );
  };
  //Get Historical_location by Governer_id
  public getHistorical_locationsByGovernerIDService = async (
    Governer_id: string
  ) => {
    if (!Types.ObjectId.isValid(Governer_id)) {
      throw new BadRequestError("Invalid Governer ID format");
    }
    const Historical_locations = await this.historical_locationsModel.find({
      governor_id: new Types.ObjectId(Governer_id),
    });
    if (Historical_locations instanceof Error)
      throw new InternalServerError("Internal server error");
    // throw new Error ("Internal server error");

    if (Historical_locations == null)
      throw new NotFoundError("Historical Location not found");
    return new response(
      true,
      Historical_locations,
      "Historical Location is found",
      200
    );
  };
  //Update Historical_location
  public updateHistorical_locationService = async (
    historical_location_id: string,
    updated_historical_location: Update_IHistorical_locationDTO
  ) => {
    if (!Types.ObjectId.isValid(historical_location_id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location = await this.historical_locationsModel.findById(
      new Types.ObjectId(historical_location_id)
    );
    if (Historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_location == null) {
      throw new NotFoundError("Historical Location not found");
    }

    //Code to check if the value corresponds to the key in the object
    const tags_keys = updated_historical_location.tags
      ? new Map(Object.entries(updated_historical_location.tags))
      : new Map();
    if (!(tags_keys instanceof Map || tags_keys == null)) {
      throw new BadRequestError(
        "Tags should be an object of map key-value pairs"
      );
    }
    if (
      (tags_keys && tags_keys.size > 0) ||
      tags_keys == null ||
      tags_keys == undefined
    ) {
      const usetags = await this.checkIfValueIsRIght(tags_keys);
      if (usetags) {
        updated_historical_location.tags = tags_keys;
      }
    }
    // end of code to check if the value corresponds to the key in the object
    const Updated_historical_location_response =
      await this.historical_locationsModel.findByIdAndUpdate(
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
    return new response(
      true,
      Updated_historical_location_response,
      "Historical Location is updated",
      200
    );
  };
  //Delete Historical_location
  public async deleteHistorical_locationService(
    historical_location_id: Types.ObjectId
  ) {
    if (!Types.ObjectId.isValid(historical_location_id)) {
      throw new BadRequestError("Invalid historical location ID format");
    }
    const Historical_location =
      await this.historical_locationsModel.findByIdAndDelete(
        historical_location_id
      );
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
    return new response(
      true,
      Historical_location,
      "Historical Location is deleted",
      200
    );
  }

  public async getSearchHistorical_locationService(
    name: string,
    category: string,
    tag: string
  ) {
    if (!name && !category && !tag) throw new BadRequestError("Invalid input");

    const historical_locations = await this.historical_locationsModel
      .find({ name: name, tags: tag })
      .populate({ path: "category", match: { type: category } })
      .populate("comments")
      .populate({ path: "governor_id", select: "name" });
    if (historical_locations instanceof Error)
      throw new InternalServerError("Internal server error");

    if (historical_locations == null)
      throw new NotFoundError("Historical locations not found");

    if (historical_locations.length == 0)
      throw new NotFoundError("No Historical locations with this search data");

    return new response(
      true,
      historical_locations,
      "Fetched historical locations",
      200
    );
  }
  public async getUpcomingHistorical_locationsService() {
    const today = Date.now();
    const historical_locations = await this.historical_locationsModel
      .find({ date_time: { $gte: today } })
      .populate("category")
      .populate("comments")
      .populate({ path: "governor_id", select: "name" });

    if (historical_locations instanceof Error)
      throw new InternalServerError("Internal server error");

    if (historical_locations == null)
      throw new NotFoundError("Historical locations not found");

    if (historical_locations.length == 0)
      throw new NotFoundError(
        "No upcoming historical locations with searched data"
      );
    return new response(
      true,
      historical_locations,
      "Fetched upcoming historical locations",
      200
    );
  }
  public async getFilteredHistorical_locationsService(filters: {
    tags?: string[];
  }) {
    if (!filters) {
      const historical_locations = await this.historical_locationsModel.find();
      return new response(
        true,
        historical_locations,
        "All historical locations are fetched no filter applied",
        200
      );
    }
    const matchStage: any = {};
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
    if (filters.tags) {
      aggregationPipeline.push({
        $match: {
          "tagDetails.type": { $in: filters.tags },
        },
      });
    }
    const historical_locations = await this.historical_locationsModel.aggregate(
      aggregationPipeline
    );
    if (historical_locations instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(
      true,
      historical_locations,
      "Filtered itineraries are fetched",
      200
    );
  }
}

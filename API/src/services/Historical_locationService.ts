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
} from "@/interfaces/IHistorical_location";
@Service()
export default class Historical_locationService {
  constructor(
    @Inject("historical_locationModel")
    private historical_locationsModel: Models.Historical_locationsModel,
    @Inject("historical_tagModel")
    private historical_tagModel: Models.Historical_tagModel
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
  public getAllHistorical_locationService = async () => {
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
      "All activites are fetched",
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
    return new response(true, historical_location, "Activity", 201);
  };

  public getHistorical_locationByIDService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location = await this.historical_locationsModel.findById(
      new Types.ObjectId(id)
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
  public getHistorical_locationByGovernerIDService = async (
    Governer_id: string
  ) => {
    if (!Types.ObjectId.isValid(Governer_id)) {
      throw new BadRequestError("Invalid Governer ID format");
    }
    const Historical_location = await this.historical_locationsModel.findOne({
      governor_id: new Types.ObjectId(Governer_id),
    });
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
  //Update Historical_location
  public updateHistorical_locationService = async (
    id: string,
    Data: Update_IHistorical_locationDTO
  ) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location = await this.historical_locationsModel.findById(
      new Types.ObjectId(id)
    );
    if (Historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_location == null) {
      throw new NotFoundError("Historical Location not found");
    }
    const updateFields: Partial<Update_IHistorical_locationDTO> = {};
    if (Data.name) updateFields.name = Data.name;
    if (Data.description) updateFields.description = Data.description;
    if (Data.picture) updateFields.picture = Data.picture;
    if (Data.location) updateFields.location = Data.location;
    if (Data.opening_hours_from)
      updateFields.opening_hours_from = Data.opening_hours_from;
    if (Data.opening_hours_to)
      updateFields.opening_hours_to = Data.opening_hours_to;
    if (Data.native_price) updateFields.native_price = Data.native_price;
    if (Data.foreign_price) updateFields.foreign_price = Data.foreign_price;
    if (Data.student_price) updateFields.student_price = Data.student_price;
    if (Data.tags) updateFields.tags = Data.tags;

    //Code to check if the value corresponds to the key in the object
    const tags_keys = Data.tags
      ? new Map(Object.entries(Data.tags))
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
        Data.tags = tags_keys;
      }
    }
    // end of code to check if the value corresponds to the key in the object
    const Updated_historical_location =
      await this.historical_locationsModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: updateFields },
        { new: true } // Returns the updated document
      );
    if (Updated_historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Updated_historical_location == null) {
      throw new NotFoundError("Historical Location not found");
    }
    return new response(
      true,
      Updated_historical_location,
      "Historical Location is updated",
      200
    );
  };
  //Delete Historical_location
  public deleteHistorical_locationService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID format");
    }
    const Historical_location =
      await this.historical_locationsModel.findByIdAndDelete(
        new Types.ObjectId(id)
      );
    if (Historical_location instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_location == null) {
      throw new NotFoundError("Historical Location not found");
    }
    return new response(true, null, "Historical Location is deleted", 200);
  };
}

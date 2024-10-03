import {
  Update_IHistorical_locationDTO,
  IHistorical_locationDTO,
} from "@/interfaces/IHistorical_location";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";

import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import mongoose, { Types } from "mongoose";
@Service()
export default class Historical_locationService {
  constructor(
    @Inject("historical_locationModel")
    private historical_locationsModel: Models.Historical_locationsModel
  ) {}
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
    };
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
      id
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
}

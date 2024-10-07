import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";

import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import mongoose, { Types } from "mongoose";
import {
  IHistorical_tag,
  IHistorical_tagDTO,
} from "@/interfaces/IHistorical_tag";
@Service()
export default class Historical_tagService {
  constructor(
    @Inject("historical_tagModel")
    private historical_tagModel: Models.Historical_tagModel
  ) {}
  // Get all historical tags
  public getAllHistorical_tagService = async () => {
    const Historical_tag = await this.historical_tagModel.find({});
    if (Historical_tag instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_tag == null) {
      throw new NotFoundError("No Historical_tags Found");
    }
    return new response(true, Historical_tag, "All tags are fetched", 200);
  };
  // Create a historical tag
  public createHistorical_tagService = async (
    historical_tagInput: IHistorical_tagDTO
  ) => {
    const historical_tagData: IHistorical_tagDTO = {
      name: historical_tagInput.name,
      Values: historical_tagInput.Values,
    };
    const historical_tag = await this.historical_tagModel.create(
      historical_tagData
    );
    if (historical_tag instanceof Error)
      throw new InternalServerError("Internal server error");

    if (historical_tag == null) throw new NotFoundError("Cannot be created");
    return new response(true, historical_tag, "Tag has been created", 201);
  };
  // Get a historical tag by ID
  public getHistorical_tagByIDService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const Historical_tag = await this.historical_tagModel.findById(
      new Types.ObjectId(id)
    );
    if (Historical_tag instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_tag == null) {
      throw new NotFoundError("No Historical_tag Found");
    }
    return new response(true, Historical_tag, "Tag is fetched", 200);
  };
  // Update a historical tag
  public updateHistorical_tagService = async (
    id: string,
    updatedHistoricalTag: IHistorical_tagDTO
  ) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const Historical_tag_check = await this.historical_tagModel.findById(
      new Types.ObjectId(id)
    );
    if (Historical_tag_check instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_tag_check == null) {
      throw new NotFoundError("Historical Location not found");
    }

    const Historical_tag = await this.historical_tagModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      updatedHistoricalTag,
      { new: true }
    );
    if (Historical_tag instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_tag == null) {
      throw new NotFoundError("No Historical_tag Found");
    }
    return new response(true, Historical_tag, "Tag has been updated", 200);
  };
  // Delete a historical tag
  public deleteHistorical_tagService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const Historical_tag = await this.historical_tagModel.findByIdAndDelete(
      new Types.ObjectId(id)
    );
    if (Historical_tag instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (Historical_tag == null) {
      throw new NotFoundError("No Historical_tag Found");
    }

    return new response(true, null, "Tag has been deleted", 200);
  };
}

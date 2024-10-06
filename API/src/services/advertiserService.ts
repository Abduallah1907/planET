import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import { Types } from "mongoose";
import { IAdvertiser, IAdvertiserDTO } from "@/interfaces/IAdvertiser";
@Service()
export default class AdvertiserService {
  constructor(
    @Inject("advertiserModel") private advertiserModel: Models.AdvertiserModel
  ) {}
  //Create Advertiser
  public createAdvertiserService = async (advertiserData: IAdvertiser) => {
    const advertiser = await this.advertiserModel.create(advertiserData);
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    return new response(true, advertiser, "Advertiser created", 201);
  };
  //Get all Advertisers
  public getAllAdvertisersService = async () => {
    const advertisers = await this.advertiserModel.find({});
    if (advertisers instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertisers == null) throw new NotFoundError("No Advertisers Found");
    return new response(true, advertisers, "All Advertisers are fetched", 200);
  };
  //Get Advertiser by ID
  public getAdvertiserByIDService = async (id: string) => {
    const advertiser = await this.advertiserModel.findById(
      new Types.ObjectId(id)
    );
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser found", 200);
  };
  //Get Advertiser by User ID
  public getAdvertiserByUserIDService = async (userID: string) => {
    const advertiser = await this.advertiserModel.findOne({
      user_id: new Types.ObjectId(userID),
    });
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser found", 200);
  };
  //Get Advertiser by Activity ID
  public getAdvertiserByActivityIDService = async (activityID: string) => {
    const advertiser = await this.advertiserModel.findOne({
      activities: new Types.ObjectId(activityID),
    });
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser found", 200);
  };
  //Update Advertiser
  public updateAdvertiserService = async (
    id: string,
    advertiserData: IAdvertiserDTO
  ) => {
    const advertisercheck = await this.advertiserModel.findById(
      new Types.ObjectId(id)
    );
    if (advertisercheck instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (advertisercheck == null) {
      throw new NotFoundError("No Activity with this ID");
    }
    if (!advertiserData) {
      throw new BadRequestError("Advertiser data is undefined");
    }

    const UpdatedFields: Partial<IAdvertiserDTO> = {};
    if (advertiserData.activities !== undefined) {
      UpdatedFields.activities = advertiserData.activities;
    }
    if (advertiserData.documents_required !== undefined) {
      UpdatedFields.documents_required = advertiserData.documents_required;
    }
    if (advertiserData.link_to_website !== undefined) {
      UpdatedFields.link_to_website = advertiserData.link_to_website;
    }
    if (advertiserData.hotline !== undefined) {
      UpdatedFields.hotline = advertiserData.hotline;
    }
    if (advertiserData.about !== undefined) {
      UpdatedFields.about = advertiserData.about;
    }
    if (advertiserData.logo !== undefined) {
      UpdatedFields.logo = advertiserData.logo;
    }
    if (advertiserData.company_profile !== undefined) {
      UpdatedFields.company_profile = advertiserData.company_profile;
    }

    const advertiser = await this.advertiserModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      UpdatedFields,
      { new: true }
    );
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser updated", 200);
  };
  //Delete Advertiser
  public deleteAdvertiserService = async (id: string) => {
    const advertiser = await this.advertiserModel.findByIdAndDelete(
      new Types.ObjectId(id)
    );
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, null, "Advertiser deleted", 200);
  };
}

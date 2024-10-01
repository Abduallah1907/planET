import Tour_Guide from "@/models/Tour_guide";
import { ObjectId, Types } from "mongoose";
import response from "@/types/responses/response";
import User from "@/models/user";
import UserRoles from "@/types/enums/userRoles";
import Previous_Work from "@/models/Previous_work";
import { Inject, Service } from "typedi";
import { HttpError, InternalServerError } from "@/types/Errors";
import { UnauthorizedError } from "express-jwt";
@Service()
export default class TourGuideService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("previous_workModel") private previousWorkModel: Models.Previous_workModel
  ) {}
  // CUD for work experiences
  // Read is mostly like not needed as it will be viewed along side the profile, so the logic for that is moved down there
  // *depends on frontend implementation tho
  public async createPreviousWorkService(title: String, place: String, from: Date, to: Date): Promise<any> {
    const newWorkExperience = await this.previousWorkModel.create({ title, place, from, to });
    if (newWorkExperience instanceof Error) throw new InternalServerError("Internal server error");

    return new response(true, newWorkExperience, "Work experience created successfully!", 200);
  }

  public async updatePreviousWorkService(_id: ObjectId, title: string, place: string, from: Date, to: Date): Promise<any> {
    const previousWork = await this.previousWorkModel.findById(_id);
    if (!previousWork) throw new Error("Previous work not found");

    // this is to prevent empty data from overwriting the old data
    if (title) previousWork.title = title;
    if (place) previousWork.place = place;
    if (from) previousWork.from = from;
    if (to) previousWork.to = to;
    await previousWork.save();
    return new response(true, previousWork, "Previous work updated!", 200);
  }

  public async deletePreviousWorkService(_id: ObjectId) {
    if (!_id) throw new Error("_id is required");
    if (!Types.ObjectId.isValid(_id.toString())) throw new Error("_id is invalid");

    const deletedPreviousWork = await this.previousWorkModel.findByIdAndDelete(_id);
    if (!deletedPreviousWork) throw new HttpError("Previous work not found", 404);
    return new response(true, deletedPreviousWork, "Previous work deleted!", 200);
  }
  // CRUD for tour guide profile
  public async getProfileService(_id: ObjectId): Promise<any> {
    if (!Types.ObjectId.isValid(_id.toString())) throw new HttpError("_id is invalid", 400);
    const tourGuideProfile = await this.tourGuideModel.findById(_id).populate("previous_work_description");

    if (tourGuideProfile instanceof Error) throw new InternalServerError("Internal server error");
    if (!tourGuideProfile) throw new HttpError("Tour guide not found", 404);

    return new response(true, tourGuideProfile, "Tour guide profile", 200);
  }

  public async updateProfileService(
    years_of_experience: number,
    previous_work_description: [ObjectId],
    photo: string,
    user_id: ObjectId,
    tour_guide_id: ObjectId
  ): Promise<any> {
    const user = await this.userModel.findById(user_id).select("status role");
    if (user) {
      const isAccepted = user.status;
      const role = user.role;
      if (!isAccepted) throw new HttpError("The tour guide has not been accepted by an admin yet", 403);
      if (role !== UserRoles.TourGuide) throw new HttpError("This user is not a tour guide", 400);
    } else {
      throw new HttpError("This user is not registered to our system?? This error should never be thrown :)", 400);
    }

    const tourGuide = await Tour_Guide.findById(tour_guide_id);
    if (!tourGuide)
      throw new HttpError(
        "For some reason, the tour guide is registered as user and not in the tour guide table. In other words, if this error is thrown, something has gone terribly wrong",
        404
      );
    // this checks if any of the fields are empty; so that if they are empty they are
    //  kept as is in the database and not overwritten to also be empty
    if (photo) tourGuide.photo = photo;
    if (years_of_experience) tourGuide.years_of_experience = years_of_experience;
    // if (!previous_work_description)
    //   previous_work_description = tourGuide.previous_work_description;
    await tourGuide.save();
    return new response(true, tourGuide, "Profile updated successfully!", 200);
  }
}

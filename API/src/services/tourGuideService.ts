import { ObjectId, Types } from "mongoose";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import Container, { Inject, Service } from "typedi";
import { HttpError, InternalServerError, NotFoundError } from "@/types/Errors";
import { IPreviousWorkInputDTO, IPreviousWorkOutputDTO, IPreviousWorkUpdateDTO } from "@/interfaces/IPrevious_work";
import { ITourGuideInput, ITourGuideOutput } from "@/interfaces/ITour_guide";
import { name } from "agenda/dist/agenda/name";
import { it } from "node:test";
import UserService from "./userService";
import { IUserInputDTO } from "@/interfaces/IUser";
@Service()
export default class TourGuideService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("previous_workModel") private previousWorkModel: Models.Previous_workModel,
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel
  ) {}
  // CUD for work experiences
  // Read is mostly like not needed as it will be viewed along side the profile, so the logic for that is moved down there
  // *depends on frontend implementation tho
  // creates the work experience AND inserts it into the tour guide
  public async createPreviousWorkService(previousWork: IPreviousWorkInputDTO): Promise<any> {
    const tourGuide = await this.tourGuideModel.findOne({ tour_guide_id: previousWork.tour_guide_user_id });
    if (!tourGuide) throw new HttpError("Tour guide not found. Is the ID correct?", 404);

    const newWorkExperience = await this.previousWorkModel.create(previousWork);

    tourGuide.previous_work_description.push(newWorkExperience);
    await tourGuide.save();

    if (newWorkExperience instanceof Error) throw new InternalServerError("Internal server error");
    const previousWorkOutput: IPreviousWorkOutputDTO = {
      previous_work_id: newWorkExperience._id,
      title: newWorkExperience.title,
      place: newWorkExperience.place,
      from: newWorkExperience.from,
      to: newWorkExperience.to,
    };
    return new response(true, previousWorkOutput, "Work experience created successfully!", 201);
  }

  public async updatePreviousWorkService(updatedPreviousWorkInfo: IPreviousWorkUpdateDTO): Promise<any> {
    if (!Types.ObjectId.isValid(updatedPreviousWorkInfo.previous_work_id.toString())) throw new Error("_id is invalid");
    const previousWork = await this.previousWorkModel.findById(updatedPreviousWorkInfo.previous_work_id);
    if (!previousWork) throw new Error("Previous work not found");

    previousWork.title = updatedPreviousWorkInfo.title;
    previousWork.place = updatedPreviousWorkInfo.place;
    previousWork.from = updatedPreviousWorkInfo.from;
    previousWork.to = updatedPreviousWorkInfo.to;
    await previousWork.save();
    const previousWorkOutput: IPreviousWorkOutputDTO = {
      previous_work_id: previousWork._id,
      title: previousWork.title,
      place: previousWork.place,
      from: previousWork.from,
      to: previousWork.to,
    };
    return new response(true, previousWorkOutput, "Previous work updated!", 201);
  }

  public async deletePreviousWorkService(previous_work_id: Types.ObjectId, tour_guide_user_id: Types.ObjectId) {
    if (!Types.ObjectId.isValid(previous_work_id.toString())) throw new Error("_id is invalid");
    if (!Types.ObjectId.isValid(tour_guide_user_id.toString())) throw new Error("_id is invalid");

    const tourGuide = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id });
    if (!tourGuide) throw new HttpError("Tour guide not found", 404);

    const deletedPreviousWork = await this.previousWorkModel.findByIdAndDelete(previous_work_id);
    if (!deletedPreviousWork) throw new HttpError("Previous work not found", 404);

    tourGuide.previous_work_description.pull(deletedPreviousWork._id);
    await tourGuide.save();

    const deletedPreviousWorkOutput = { previous_work_id: deletedPreviousWork._id, title: deletedPreviousWork.title };
    return new response(true, deletedPreviousWorkOutput, "Previous work deleted!", 200);
  }

  // CRUD for tour guide profile

  public async createProfileService(tourGuideData: ITourGuideInput) {
    const userData: IUserInputDTO = {
      email: tourGuideData.email,
      name: tourGuideData.name,
      username: tourGuideData.username,
      password: tourGuideData.password,
      role: UserRoles.TourGuide,
      phone_number: tourGuideData.phone_number,
    };
    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(userData);

    if (newUserResponse.data instanceof Error) throw new InternalServerError("Internal server error");

    const newTourGuide = await this.tourGuideModel.create({ user_id: newUserResponse.data._id, photo: "link.png", approval: true });
    return new response(true, { tour_guide_user_id: newTourGuide.user_id }, "Tour guide created", 201);
  }
  public async getProfileService(tour_guide_user_id: Types.ObjectId): Promise<any> {
    if (!Types.ObjectId.isValid(tour_guide_user_id.toString())) throw new HttpError("_id is invalid", 400);
    const tourGuideProfile = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id }).populate("previous_work_description");

    if (tourGuideProfile instanceof Error) throw new InternalServerError("Internal server error");
    if (!tourGuideProfile) throw new HttpError("Tour guide not found", 404);

    const tourGuideUser = await this.userModel.findById(tour_guide_user_id).select("username name");
    if (!tourGuideUser) throw new HttpError("Tour guide user not found", 404);
    const tourGuideOutput: ITourGuideOutput = {
      comments: tourGuideProfile.comments,
      itineraries: tourGuideProfile.itineraries,
      years_of_experience: tourGuideProfile.years_of_experience,
      previous_work_description: tourGuideProfile.previous_work_description,
      photo: tourGuideProfile.photo,
      username: tourGuideUser.username,
      name: tourGuideUser.name,
    };
    return new response(true, tourGuideOutput, "Tour guide profile", 201);
  }

  public async updateProfileService(years_of_experience: number, photo: string, tour_guide_user_id: ObjectId): Promise<any> {
    const tourGuideUser = await this.userModel.findById(tour_guide_user_id).select("status role username name");
    if (tourGuideUser) {
      const isAccepted = tourGuideUser.status;
      const role = tourGuideUser.role;
      if (!isAccepted) throw new HttpError("The tour guide has not been accepted by an admin yet", 403);
      if (role !== UserRoles.TourGuide) throw new HttpError("This user is not a tour guide", 400);
    } else {
      throw new HttpError("This user is not registered to our system?? This error should never be thrown :)", 400);
    }

    const tourGuideProfile = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id }).populate("previous_work_description");
    if (!tourGuideProfile)
      throw new HttpError(
        "For some reason, the tour guide is registered as user and not in the tour guide table. In other words, if this error is thrown, something has gone terribly wrong",
        404
      );
    tourGuideProfile.photo = photo;
    tourGuideProfile.years_of_experience = years_of_experience;
    await tourGuideProfile.save();

    const tourGuideOutput: ITourGuideOutput = {
      comments: tourGuideProfile.comments,
      itineraries: tourGuideProfile.itineraries,
      years_of_experience: tourGuideProfile.years_of_experience,
      previous_work_description: tourGuideProfile.previous_work_description,
      photo: tourGuideProfile.photo,
      username: tourGuideUser.username,
      name: tourGuideUser.name,
    };
    return new response(true, tourGuideOutput, "Profile updated successfully!", 201);
  }
}

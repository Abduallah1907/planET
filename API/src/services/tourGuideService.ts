import { ObjectId, Types } from "mongoose";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import Container, { Inject, Service } from "typedi";
import { HttpError, InternalServerError, NotFoundError } from "@/types/Errors";
import { ITour_GuideUpdateDTO } from "@/interfaces/ITour_guide";
import {
  IPreviousWorkInputDTO,
  IPreviousWorkOutputDTO,
  IPreviousWorkUpdateDTO,
} from "@/interfaces/IPrevious_work";
import { ITourGuideInput, ITourGuideOutput } from "@/interfaces/ITour_guide";
import UserService from "./userService";
import { IUserInputDTO } from "@/interfaces/IUser";
@Service()
export default class TourGuideService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("previous_workModel")
    private previousWorkModel: Models.Previous_workModel,
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel
  ) {}
  // CUD for work experiences
  // Read is mostly like not needed as it will be viewed along side the profile, so the logic for that is moved down there
  // *depends on frontend implementation tho
  // creates the work experience AND inserts it into the tour guide
  public async createPreviousWorkService(
    previousWork: IPreviousWorkInputDTO
  ): Promise<any> {
    const tourGuide = await this.tourGuideModel.findOne({
      tour_guide_id: previousWork.tour_guide_id,
    });
    if (!tourGuide)
      throw new HttpError("Tour guide not found. Is the ID correct?", 404);

    const newWorkExperience = await this.previousWorkModel.create(previousWork);

    tourGuide.previous_work_description.push(newWorkExperience);
    await tourGuide.save();

    if (newWorkExperience instanceof Error)
      throw new InternalServerError("Internal server error");
    const previousWorkOutput: IPreviousWorkOutputDTO = {
      previous_work_id: newWorkExperience._id,
      title: newWorkExperience.title,
      place: newWorkExperience.place,
      from: newWorkExperience.from,
      to: newWorkExperience.to,
    };
    return new response(
      true,
      previousWorkOutput,
      "Work experience created successfully!",
      201
    );
  }

  public async updatePreviousWorkService(
    updatedPreviousWorkInfo: IPreviousWorkUpdateDTO
  ): Promise<any> {
    if (
      !Types.ObjectId.isValid(
        updatedPreviousWorkInfo.previous_work_id.toString()
      )
    )
      throw new Error("_id is invalid");
    const previousWork = await this.previousWorkModel.findById(
      updatedPreviousWorkInfo.previous_work_id
    );
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
    return new response(
      true,
      previousWorkOutput,
      "Previous work updated!",
      201
    );
  }

  public async deletePreviousWorkService(
    previous_work_id: Types.ObjectId,
    tour_guide_id: Types.ObjectId
  ) {
    if (!Types.ObjectId.isValid(previous_work_id.toString()))
      throw new Error("_id is invalid");
    if (!Types.ObjectId.isValid(tour_guide_id.toString()))
      throw new Error("_id is invalid");

    const tourGuide = await this.tourGuideModel.findById({
      tour_guide_id,
    });
    if (!tourGuide) throw new HttpError("Tour guide not found", 404);

    const deletedPreviousWork = await this.previousWorkModel.findByIdAndDelete(
      previous_work_id
    );
    if (!deletedPreviousWork)
      throw new HttpError("Previous work not found", 404);

    tourGuide.previous_work_description.pull(deletedPreviousWork._id);
    await tourGuide.save();

    const deletedPreviousWorkOutput = {
      previous_work_id: deletedPreviousWork._id,
      title: deletedPreviousWork.title,
    };
    return new response(
      true,
      deletedPreviousWorkOutput,
      "Previous work deleted!",
      200
    );
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

    if (newUserResponse.data instanceof Error)
      throw new InternalServerError("Internal server error");

    const newTourGuide = await this.tourGuideModel.create({
      user_id: newUserResponse.data._id,
      photo: tourGuideData.photo,
      documents_required: tourGuideData.documents_required,
      approval: true,
    });
    return new response(
      true,
      { tour_guide_user_id: newTourGuide.user_id },
      "Tour guide created",
      201
    );
  }
  public async getProfileService(email: string): Promise<any> {
    const userProfile = await this.userModel
      .findOne({
        email: email,
        role: UserRoles.TourGuide,
      })
      .select("username name phone_number");

    if (userProfile instanceof Error)
      throw new InternalServerError("Internal server error");
    if (!userProfile) throw new HttpError("Tour guide not found", 404);

    const tourguide_user_id = userProfile._id;
    const tourGuideUser = await this.tourGuideModel
      .findOne({ user_id: tourguide_user_id })
      .populate("previous_work_description");

    if (!tourGuideUser) throw new HttpError("Tour guide user not found", 404);
    const tourGuideOutput: ITourGuideOutput = {
      comments: tourGuideUser.comments,
      itineraries: tourGuideUser.itineraries,
      years_of_experience: tourGuideUser.years_of_experience,
      previous_work_description: tourGuideUser.previous_work_description,
      photo: tourGuideUser.photo,
      username: userProfile.username,
      name: tourGuideUser.name,
      phone_number: userProfile.phone_number,
    };
    return new response(true, tourGuideOutput, "Tour guide profile", 200);
  }

  public async updateProfileService(
    updatedTourGuide: ITour_GuideUpdateDTO,
    email: string
  ): Promise<any> {
    const { years_of_experience, photo, phone_number } = updatedTourGuide;
    const tourGuideUser = await this.userModel
      .findOneAndUpdate(
        { email: email, role: UserRoles.TourGuide },
        { phone_number: phone_number },
        { new: true }
      )
      .select("status role username name phone_number");

    if (tourGuideUser) {
      const isAccepted = tourGuideUser.status;
      const role = tourGuideUser.role;
      if (!isAccepted)
        throw new HttpError(
          "The tour guide has not been accepted by an admin yet",
          403
        );
      if (role !== UserRoles.TourGuide)
        throw new HttpError("This user is not a tour guide", 400);
    } else {
      throw new HttpError(
        "This user is not registered to our system?? This error should never be thrown :)",
        400
      );
    }
    const tour_guide_user_id = tourGuideUser._id;
    const tourGuideProfile = await this.tourGuideModel
      .findOneAndUpdate(
        { user_id: tour_guide_user_id },
        { photo: photo, years_of_experience: years_of_experience },
        { new: true }
      )
      .populate("previous_work_description");
    if (!tourGuideProfile)
      throw new HttpError(
        "For some reason, the tour guide is registered as user and not in the tour guide table. In other words, if this error is thrown, something has gone terribly wrong",
        404
      );
    const tourGuideOutput: ITourGuideOutput = {
      comments: tourGuideProfile.comments,
      itineraries: tourGuideProfile.itineraries,
      years_of_experience: tourGuideProfile.years_of_experience,
      previous_work_description: tourGuideProfile.previous_work_description,
      photo: tourGuideProfile.photo,
      username: tourGuideUser.username,
      phone_number: tourGuideUser.phone_number,
      name: tourGuideUser.name,
    };
    return new response(
      true,
      tourGuideOutput,
      "Profile updated successfully!",
      200
    );
  }
}

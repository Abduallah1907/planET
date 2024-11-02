import mongoose, { ObjectId, Types, Date } from "mongoose";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import Container, { Inject, Service } from "typedi";
import { ITour_Guide, ITour_GuideUpdateDTO } from "@/interfaces/ITour_guide";
import { UnauthorizedError, HttpError, InternalServerError, NotFoundError, ForbiddenError, BadRequestError } from "@/types/Errors";
import { IPreviousWorkInputDTO, IPreviousWorkOutputDTO, IPreviousWorkUpdateDTO } from "@/interfaces/IPrevious_work";
import { ITourGuideInput, ITourGuideOutput } from "@/interfaces/ITour_guide";
import UserService from "./userService";
import { IUserInputDTO } from "@/interfaces/IUser";
import bcrypt from "bcryptjs";
import { IItinerary } from "@/interfaces/IItinerary";

@Service()
export default class TourGuideService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("previous_workModel")
    private previousWorkModel: Models.Previous_workModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel,
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel
  ) {}

  // CUD for work experiences
  public async createPreviousWorkService(previousWork: IPreviousWorkInputDTO): Promise<any> {
    const tourGuide = await this.tourGuideModel.findById(previousWork.tour_guide_id);
    if (!tourGuide) throw new HttpError("Tour guide not found. Is the ID correct?", 404);

    const newWorkExperience = await this.previousWorkModel.create(previousWork);

    tourGuide.previous_work_description.push(newWorkExperience);
    await tourGuide.save();

    if (newWorkExperience instanceof Error) throw new InternalServerError("Internal server error");
    const previousWorkOutput: IPreviousWorkOutputDTO = {
      previous_work_id: (newWorkExperience._id as Types.ObjectId).toString(),
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

    if (updatedPreviousWorkInfo.title !== undefined) {
      previousWork.title = updatedPreviousWorkInfo.title;
    }
    if (updatedPreviousWorkInfo.place !== undefined) {
      previousWork.place = updatedPreviousWorkInfo.place;
    }
    if (updatedPreviousWorkInfo.from !== undefined) {
      previousWork.from = updatedPreviousWorkInfo.from;
    }
    if (updatedPreviousWorkInfo.to !== undefined) {
      previousWork.to = updatedPreviousWorkInfo.to;
    }

    await previousWork.save();
    const previousWorkOutput: IPreviousWorkOutputDTO = {
      previous_work_id: (previousWork._id as Types.ObjectId).toString(),
      title: previousWork.title,
      place: previousWork.place,
      from: previousWork.from,
      to: previousWork.to,
    };
    return new response(true, previousWorkOutput, "Previous work updated!", 201);
  }

  public async deletePreviousWorkService(previous_work_id: Types.ObjectId, tour_guide_id: Types.ObjectId) {
    if (!Types.ObjectId.isValid(previous_work_id.toString())) throw new Error("_id is invalid");
    if (!Types.ObjectId.isValid(tour_guide_id.toString())) throw new Error("_id is invalid");

    const tourGuide = await this.tourGuideModel.findById({
      tour_guide_id,
    });
    if (!tourGuide) throw new HttpError("Tour guide not found", 404);

    const deletedPreviousWork = await this.previousWorkModel.findByIdAndDelete(previous_work_id);
    if (!deletedPreviousWork) throw new HttpError("Previous work not found", 404);

    tourGuide.previous_work_description.pull(deletedPreviousWork._id);
    await tourGuide.save();

    const deletedPreviousWorkOutput = {
      previous_work_id: deletedPreviousWork._id,
      title: deletedPreviousWork.title,
    };
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

    const newTourGuide = await this.tourGuideModel.create({
      user_id: newUserResponse.data._id,
      logo: tourGuideData.logo,
      documents_required: tourGuideData.documents_required,
      approval: true,
    });
    return new response(true, { tour_guide_user_id: newTourGuide.user_id }, "Tour guide created", 201);
  }

  public async getProfileService(email: string): Promise<any> {
    const userProfile = await this.userModel
      .findOne({
        email: email,
        role: UserRoles.TourGuide,
      })
      .select("username name phone_number");

    if (userProfile instanceof Error) throw new InternalServerError("Internal server error");
    if (!userProfile) throw new HttpError("Tour guide not found", 404);

    const tourguide_user_id = userProfile._id;
    const tourGuideUser = await this.tourGuideModel.findOne({ user_id: tourguide_user_id }).populate("previous_work_description");

    if (!tourGuideUser) throw new HttpError("Tour guide user not found", 404);
    const tourGuideOutput: ITourGuideOutput = {
      comments: tourGuideUser.comments,
      itineraries: tourGuideUser.itineraries,
      years_of_experience: tourGuideUser.years_of_experience,
      previous_work_description: tourGuideUser.previous_work_description,
      logo: tourGuideUser.logo,
      username: userProfile.username,
      name: tourGuideUser.name,
      phone_number: userProfile.phone_number,
    };
    return new response(true, tourGuideOutput, "Tour guide profile", 200);
  }

  public async updateProfileService(updatedTourGuide: ITour_GuideUpdateDTO, email: string): Promise<any> {
    const {
      newEmail,
      name,
      username,
      password,
      phone_number,
      years_of_experience,
      logo,
      createdPreviousWork,
      updatedPreviousWork,
      deletedPreviousWork,
    } = updatedTourGuide;

    // Hash the password if it's provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Await bcrypt.hash here
    }
    let finalUpdatedPreviousWork: ObjectId[] = [];

    const tourGuideUser = await this.userModel
      .findOneAndUpdate(
        { email: email, role: UserRoles.TourGuide },
        {
          phone_number: phone_number,
          name: name,
          username: username,
          password: hashedPassword,
          email: newEmail,
        },
        { new: true }
      )
      .select("status role username name phone_number");

    if (tourGuideUser) {
      const isAccepted = tourGuideUser.status;
      const role = tourGuideUser.role;
      if (!isAccepted) throw new HttpError("The tour guide has not been accepted by an admin yet", 403);
      if (role !== UserRoles.TourGuide) throw new HttpError("This user is not a tour guide", 400);
    } else {
      throw new HttpError("This user is not registered to our system?? This error should never be thrown :)", 400);
    }

    const tour_guide_user_id = tourGuideUser._id;

    //Handle created previous work
    if (createdPreviousWork) {
      for (const work of createdPreviousWork) {
        const newWorkExperience = await this.previousWorkModel.create({
          title: work.title,
          place: work.place,
          from: work.from,
          to: work.to,
          tour_guide_id: tour_guide_user_id,
        });
        finalUpdatedPreviousWork.push(newWorkExperience._id as ObjectId);
      }
    }
    if (updatedPreviousWork) {
      for (const work of updatedPreviousWork) {
        const workObjectId = new mongoose.Types.ObjectId(work.previous_work_id);
        const updatedWorkExperience = await this.previousWorkModel.findByIdAndUpdate(
          workObjectId,
          {
            title: work.title,
            place: work.place,
            from: work.from,
            to: work.to,
          },
          { new: true }
        );
        if (updatedWorkExperience) {
          finalUpdatedPreviousWork.push(updatedWorkExperience._id as ObjectId);
        }
      }
    }
    if (deletedPreviousWork) {
      for (const workObjectId of deletedPreviousWork) {
        await this.previousWorkModel.findByIdAndDelete(workObjectId);
      }
    }

    const tourGuideProfile = await this.tourGuideModel
      .findOneAndUpdate(
        { user_id: tour_guide_user_id },
        {
          logo: logo,
          years_of_experience: years_of_experience,
          previous_work_description: finalUpdatedPreviousWork,
        },
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
      logo: tourGuideProfile.logo,
      username: tourGuideUser.username,
      phone_number: tourGuideUser.phone_number,
      name: tourGuideUser.name,
    };

    return new response(true, tourGuideOutput, "Profile updated successfully!", 200);
  }

  public async deleteTourGuideAccountRequest(email: string): Promise<response> {
    const today = new Date();
    const tourGuideUser = await this.userModel.findOne({ email });
    if (!tourGuideUser || tourGuideUser.role !== UserRoles.TourGuide) throw new NotFoundError("Tour guide user account was not found");
    // the reason for the explicit type is because for some reason the interfaces are set up in a wron way, and idk how to fix
    // also whether available dates acutally works is up to luck, pray
    const { itineraries: tourGuideUpcomingItineraries } = await this.tourGuideModel
      .findOne({ user_id: tourGuideUser._id })
      .populate({
        path: "itineraries",
        match: { available_dates: { $gte: today } },
      })
      .select("itineraries");

    if (!tourGuideUpcomingItineraries) throw new NotFoundError("Tour guide user account was not found");
    const bookedItineraries = await this.ticketModel.find({
      booking_id: { $in: tourGuideUpcomingItineraries },
    });
    console.log(bookedItineraries);
    if (bookedItineraries.length !== 0)
      throw new BadRequestError("There are still upcoming itineraries that are booked. Cannot delete until these itineraries are fufilled");

    const tourGuideData: ITour_Guide = await this.tourGuideModel.findOne({ user_id: tourGuideUser._id }).populate("itineraries");
    const tourGuideItineraries = tourGuideData.itineraries as unknown as IItinerary[];
    if (tourGuideItineraries) {
      tourGuideItineraries.forEach(async (itinerary) => {
        itinerary.active_flag = false;
        await itinerary.save();
      });
    }
    console.log(tourGuideItineraries);

    const deletedTourGuide = await this.tourGuideModel.findByIdAndDelete(tourGuideData._id);
    const deletedTourGuideUser = await this.userModel.findByIdAndDelete(tourGuideUser._id);

    return new response(true, {}, "Tour guide successfully deleted", 200);
  }
}

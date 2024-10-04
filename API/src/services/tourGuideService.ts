import { ObjectId, Types } from "mongoose";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import { Inject, Service } from "typedi";
import { HttpError, InternalServerError } from "@/types/Errors";
import { IPreviousWorkInputDTO, IPreviousWorkUpdateDTO } from "@/interfaces/IPrevious_work";
import { IItineraryCreateDTO, IItineraryUpdateDTO } from "@/interfaces/IItinerary";
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

    return new response(true, newWorkExperience, "Work experience created successfully!", 201);
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
    return new response(true, previousWork, "Previous work updated!", 201);
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

    return new response(true, deletedPreviousWork, "Previous work deleted!", 200);
  }

  // CRUD for tour guide profile
  public async getProfileService(tour_guide_user_id: Types.ObjectId): Promise<any> {
    if (!Types.ObjectId.isValid(tour_guide_user_id.toString())) throw new HttpError("_id is invalid", 400);
    const tourGuideProfile = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id }).populate("previous_work_description");

    if (tourGuideProfile instanceof Error) throw new InternalServerError("Internal server error");
    if (!tourGuideProfile) throw new HttpError("Tour guide not found", 404);

    return new response(true, tourGuideProfile, "Tour guide profile", 201);
  }

  public async updateProfileService(years_of_experience: number, photo: string, tour_guide_user_id: ObjectId): Promise<any> {
    const user = await this.userModel.findById(tour_guide_user_id).select("status role");
    if (user) {
      const isAccepted = user.status;
      const role = user.role;
      if (!isAccepted) throw new HttpError("The tour guide has not been accepted by an admin yet", 403);
      if (role !== UserRoles.TourGuide) throw new HttpError("This user is not a tour guide", 400);
    } else {
      throw new HttpError("This user is not registered to our system?? This error should never be thrown :)", 400);
    }

    const tourGuide = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id });
    if (!tourGuide)
      throw new HttpError(
        "For some reason, the tour guide is registered as user and not in the tour guide table. In other words, if this error is thrown, something has gone terribly wrong",
        404
      );
    tourGuide.photo = photo;
    tourGuide.years_of_experience = years_of_experience;
    await tourGuide.save();
    return new response(true, tourGuide, "Profile updated successfully!", 201);
  }

  // side note that somehow we need to get activity ids
  // we also need timeline object???
  public async createItineraryService(itineraryData: IItineraryCreateDTO) {
    const tour_guide = await this.tourGuideModel.findOne({ user_id: itineraryData.tour_guide_user_id });
    const tour_guide_id = tour_guide._id;
    const itineraryDataCreation = { ...itineraryData, tour_guide_id, comments: [], active_flag: true, inappropriate_flag: false };
    const newItinerary = await this.itineraryModel.create(itineraryDataCreation);

    if (newItinerary instanceof Error) throw new InternalServerError("Internal server error");

    tour_guide.itineraries.push(newItinerary._id);
    await tour_guide.save();

    return new response(true, newItinerary, "Itinerary created successfully!", 201);
  }
  public async getItineraryService(itinerary_id: Types.ObjectId) {
    const itineraryData = await this.itineraryModel.findById(itinerary_id);
    if (itineraryData instanceof Error) throw new InternalServerError("Internal server error");
    if (!itineraryData) throw new HttpError("Itinerary not found", 404);
    return new response(true, itineraryData, "Itinerary found!", 201);
  }
  public async updateItineraryService(itineraryUpdatedData: IItineraryUpdateDTO) {
    const updatedItinerary = await this.itineraryModel.findByIdAndUpdate(itineraryUpdatedData.itinerary_id, itineraryUpdatedData, { new: true });
    if (!updatedItinerary) throw new HttpError("Itinerary not found", 404);
    if (updatedItinerary instanceof Error) throw new InternalServerError("Internal server error");
    return new response(true, updatedItinerary, "Itinerary updated!", 201);
  }
  public async deleteItineraryService(tour_guide_user_id: Types.ObjectId, itinerary_id: Types.ObjectId) {
    console.log(tour_guide_user_id);
    console.log(itinerary_id);
    const tourGuide = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id });
    if (!tourGuide) throw new HttpError("Tour guide not found", 404);

    const deletedItinerary = await this.itineraryModel.findByIdAndDelete(itinerary_id);
    if (!deletedItinerary) throw new HttpError("Itinerary not found", 404);

    tourGuide.itineraries.pull(itinerary_id);
    await tourGuide.save();

    return new response(true, deletedItinerary, "Itinerary deleted!", 200);
  }

  // view all itineraries

  public async getAllItinerariesService(tour_guide_user_id: Types.ObjectId) {
    const tourGuideData = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id });
    if (tourGuideData instanceof Error) throw new InternalServerError("Internal server error");
    if (!tourGuideData) throw new HttpError("Tour guide not found", 404);
    const { itineraries } = await tourGuideData.populate("itineraries");
    return new response(true, itineraries, "Returning all found itineraries!", 201);
  }
}

import { IItineraryCreateDTO, IItineraryOutputDTO, IItineraryUpdateDTO } from "@/interfaces/IItinerary";
import { HttpError, InternalServerError, NotFoundError } from "@/types/Errors";
import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import { Types } from "mongoose";

@Service()
export default class ItineraryService {
  constructor(
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel
  ) {}
  // we also need timeline object???
  public async createItineraryService(itineraryData: IItineraryCreateDTO) {
    const tour_guide = await this.tourGuideModel.findOne({ user_id: itineraryData.tour_guide_user_id });
    const tour_guide_id = tour_guide._id;
    const itineraryDataCreation = { ...itineraryData, tour_guide_id, comments: [], active_flag: true, inappropriate_flag: false };
    const newItinerary = await this.itineraryModel.create(itineraryDataCreation);

    if (newItinerary instanceof Error) throw new InternalServerError("Internal server error");

    tour_guide.itineraries.push(newItinerary._id);
    await tour_guide.save();

    return new response(true, { itinerary_id: newItinerary._id }, "Itinerary created successfully!", 201);
  }
  public async getItineraryByIDService(itinerary_id: Types.ObjectId) {
    const itineraryData = await this.itineraryModel.findById(itinerary_id);
    if (itineraryData instanceof Error) throw new InternalServerError("Internal server error");
    if (!itineraryData) throw new HttpError("Itinerary not found", 404);

    const itineraryOutput: IItineraryOutputDTO = {
      itinerary_id: itineraryData._id,
      tour_guide_id: itineraryData.tour_guide_id,
      name: itineraryData.name,
      activities: itineraryData.activities,
      category: itineraryData.category,
      tags: itineraryData.tags,
      available_dates: itineraryData.available_dates,
      comments: itineraryData.comments,
      drop_off_loc: itineraryData.drop_off_loc,
      languages: itineraryData.languages,
      locations: itineraryData.locations,
      pickup_loc: itineraryData.pickup_loc,
      timeline: itineraryData.timeline,
    };
    return new response(true, itineraryOutput, "Itinerary found!", 201);
  }
  public async updateItineraryService(itineraryUpdatedData: IItineraryUpdateDTO) {
    const updatedItinerary = await this.itineraryModel.findByIdAndUpdate(itineraryUpdatedData.itinerary_id, itineraryUpdatedData, { new: true });
    if (!updatedItinerary) throw new HttpError("Itinerary not found", 404);
    if (updatedItinerary instanceof Error) throw new InternalServerError("Internal server error");
    return new response(true, { itinerary_id: updatedItinerary._id }, "Itinerary updated!", 201);
  }
  public async deleteItineraryService(tour_guide_user_id: Types.ObjectId, itinerary_id: Types.ObjectId) {
    const tourGuide = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id });
    if (!tourGuide) throw new HttpError("Tour guide not found", 404);

    const deletedItinerary = await this.itineraryModel.findByIdAndDelete(itinerary_id);
    if (!deletedItinerary) throw new HttpError("Itinerary not found", 404);

    tourGuide.itineraries.pull(itinerary_id);
    await tourGuide.save();

    return new response(true, { itinerary_id: deletedItinerary._id }, "Itinerary deleted!", 200);
  }

  // view all itineraries
  public async getAllItinerariesByTourGuideIDService(tour_guide_user_id: Types.ObjectId) {
    // why not use DTO for output one might ask
    // it is because i do not want to write all the attributes thanks
    // this also leaves activities' subdocuments as is, if the front end needs that info i will fix it
    // otherwise everything is fine
    const { itineraries } = await this.tourGuideModel.findOne({ user_id: tour_guide_user_id }).populate({
      path: "itineraries",
      populate: [{ path: "activities" }, { path: "comments" }, { path: "category" }],
    });
    if (itineraries instanceof Error) throw new InternalServerError("Internal server error");
    if (!itineraries) throw new HttpError("Tour guide not found", 404);
    const itinerariesOutput: IItineraryOutputDTO[] = itineraries.map((itinearary: {}) => ({}));
    return new response(true, itineraries, "Returning all found itineraries!", 201);
  }

  public async getAllItineraries(page: number): Promise<any> {
    const itineraries = await this.itineraryModel
      .find({})
      .limit(10)
      .skip((page - 1) * 10);
    if (itineraries instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    return new response(true, itineraries, "", 200);
  }
}

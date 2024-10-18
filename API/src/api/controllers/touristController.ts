import { ITourist, ITouristCreateDTO, ITouristUpdateDTO } from "@/interfaces/ITourist";
import {
  IComment_Rating,
  IComment_RatingCreateDTOforActivity,
  IComment_RatingCreateDTOforItinerary,
  IComment_RatingCreateDTOfortourGuide,
} from "@/interfaces/IComment_rating";
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
import { Request, Response } from "express";
import { start } from "repl";
import Comment_Rating from "@/models/Comment_rating";
import { Types } from "mongoose";
import { IComplaintCreateDTO } from "@/interfaces/IComplaint";
@Service()
export class TouristController {
  public async getTourist(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const tourist = await touristService.getTouristService(email);
    res.status(tourist.status).json(tourist);
  }

  public async createTourist(req: any, res: any) {
    const touristData: ITouristCreateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const createdTourist = await touristService.createTouristService(touristData);
    res.status(createdTourist.status).json(createdTourist);
  }

  public async updateTourist(req: any, res: any) {
    const { searchEmail } = req.params;
    const touristUpdateData: ITouristUpdateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const updatedTourist = await touristService.updateTouristService(searchEmail, touristUpdateData);
    res.status(updatedTourist.status).json(updatedTourist);
  }

  public async deleteTouristAccountRequest(req: Request, res: Response): Promise<any> {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const deletionRequest = await touristService.requestTouristAccountDeletionService(email);
    res.status(deletionRequest.status).json(deletionRequest);
  }
  public async rateandcommentTour_guide(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOfortourGuide = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateandcommentTour_guideService(tourist_id, data);
    res.status(ratedTourist.status).json(ratedTourist);
  }
  public async rateandcommentItinerary(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOforItinerary = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateandcommentItineraryService(tourist_id, data);
    res.status(ratedTourist.status).json(ratedTourist);
  }
  public async rateandcommentActivity(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOforActivity = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateandcommentActivityService(tourist_id, data);
    res.status(ratedTourist.status).json(ratedTourist);
  }

  public async bookActivity(req: any, res: any) {
    const { email, activity_id } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const bookedActivity = await touristService.bookActivityService(
      email,
      activity_id
    );
    res.status(bookedActivity.status).json(bookedActivity);
  }

  public async bookItinerary(req: any, res: any) {
    const { email, itinerary_id } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const bookedItinerary = await touristService.bookItineraryService(
      email,
      itinerary_id
    );
    res.status(bookedItinerary.status).json(bookedItinerary);
  }

  public async bookHistoricalLocation(req: any, res: any) {
    const { email, historical_location_id } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const bookedHistoricalLocation =
      await touristService.bookHistoricalLocationService(
        email,
        historical_location_id
      );
    res.status(bookedHistoricalLocation.status).json(bookedHistoricalLocation);
  }

  public async recievePoints(req: any, res: any) {
    const { tourist_id, amount } = req.body;
    const touristObjectID = new Types.ObjectId(tourist_id);
    const touristService: TouristService = Container.get(TouristService);
    const recievedPoints = await touristService.recievePointsService(
      touristObjectID,
      amount
    );
    res.status(recievedPoints.status).json(recievedPoints);
  }

  public async recieveBadge(req: any, res: any) {
    const { tourist_id, points } = req.body;
    const touristObjectID = new Types.ObjectId(tourist_id);

    const touristService: TouristService = Container.get(TouristService);
    const recievedBadge = await touristService.recieveBadgeService(
      touristObjectID,
      points
    );
    res.status(recievedBadge.status).json(recievedBadge);
  }
  public async redeemPoints(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const redeemedPoints = await touristService.redeemPointsService(email);
    res.status(redeemedPoints.status).json(redeemedPoints);
  }
  // check if the tourist went with the tour guide
  public async checkTourGuide(req: any, res: any) {
    const { tourist_id } = req.params;
    const { tour_guide_email } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const checkedTourGuide = await touristService.checkTourGuideService(
      tourist_id,
      tour_guide_email
    );
    //return true or false
    res.status(checkedTourGuide.status).json(checkedTourGuide);
  }
  // check if the tourist went with the itinerary
  public async checkItinerary(req: any, res: any) {
    const { tourist_id } = req.params;
    const { itinerary_id } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const checkedItinerary = await touristService.checkItineraryService(
      tourist_id,
      itinerary_id
    );
    //return true or false
    res.status(checkedItinerary.status).json(checkedItinerary);
  }
  // check if the tourist went to the activity
  public async checkActivity(req: any, res: any) {
    const { tourist_id } = req.params;
    const { activity_id } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const checkedActivity = await touristService.checkActivityService(
      tourist_id,
      activity_id
    );
    //return true or false
    res.status(checkedActivity.status).json(checkedActivity);
  }
  //create complaint
  public async fileComplaint(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComplaintCreateDTO = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const filedComplaint = await touristService.fileComplaintService(
      tourist_id,
      data
    );
    res.status(filedComplaint.status).json(filedComplaint);
  }
}

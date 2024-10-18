import {
  ITourist,
  ITouristCreateDTO,
  ITouristUpdateDTO,
} from "@/interfaces/ITourist";
import {
  IComment_Rating,
  IComment_RatingCreateDTOforActivity,
  IComment_RatingCreateDTOforItinerary,
  IComment_RatingCreateDTOfortourGuide,
} from "@/interfaces/IComment_rating";
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
import { Types } from "mongoose";
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
    const createdTourist = await touristService.createTouristService(
      touristData
    );
    res.status(createdTourist.status).json(createdTourist);
  }

  public async updateTourist(req: any, res: any) {
    const { searchEmail } = req.params;
    const touristUpdateData: ITouristUpdateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const updatedTourist = await touristService.updateTouristService(
      searchEmail,
      touristUpdateData
    );
    res.status(updatedTourist.status).json(updatedTourist);
  }
  public async rateandcommentTour_guide(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOfortourGuide = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateandcommentTour_guideService(
      tourist_id,
      data
    );
    res.status(ratedTourist.status).json(ratedTourist);
  }
  public async rateandcommentItinerary(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOforItinerary = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateandcommentItineraryService(
      tourist_id,
      data
    );
    res.status(ratedTourist.status).json(ratedTourist);
  }
  public async rateandcommentActivity(req: any, res: any) {
    const { tourist_id } = req.params;
    const data: IComment_RatingCreateDTOforActivity = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateandcommentActivityService(
      tourist_id,
      data
    );
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
    res.status(200).json(recievedPoints);
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
    const { email, points } = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const redeemedPoints = await touristService.redeemPointsService(
      email,
      points
    );
    res.status(redeemedPoints.status).json(redeemedPoints);
  }
}

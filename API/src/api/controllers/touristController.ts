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
}

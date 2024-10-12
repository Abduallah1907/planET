import {
  ITourist,
  ITouristCreateDTO,
  ITouristUpdateDTO,
} from "@/interfaces/ITourist";
import { IComment_Rating } from "@/interfaces/IComment_rating";
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
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
  public async rateTour_guide(req: any, res: any) {
    const { tourist_id } = req.params;
    const { tour_guide_email, rating } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const ratedTourist = await touristService.rateTour_guideService(
      tourist_id,
      tour_guide_email,
      rating
    );
    res.status(ratedTourist.status).json(ratedTourist);
  }
}

import { ITourist, ITouristCreateDTO, ITouristUpdateDTO } from "@/interfaces/ITourist";
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
import { Request, Response } from "express";
import { start } from "repl";
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
}

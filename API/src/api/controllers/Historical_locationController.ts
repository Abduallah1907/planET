import {
  IHistorical_locationDTO,
  Update_IHistorical_locationDTO,
} from "../../interfaces/IHistorical_location";
import Container, { Service } from "typedi";
import Historical_locationService from "@/services/Historical_locationService";

@Service()
export class Historical_locationController {
  //Get all Historical Locations
  public async getAllHistorical_locationController(req: any, res: any) {
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.getAllHistorical_locationService();
    res.status(historical_location.status).json({ historical_location });
  }
  public async createHistorical_locationController(req: any, res: any) {
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const Historical_locationData = req.body as IHistorical_locationDTO;
    const historical_location =
      await historical_locationService.createHistorical_locationService(
        Historical_locationData
      );
    res.status(historical_location.status).json({ historical_location });
  }
  public async getHistorical_locationByIDController(req: any, res: any) {
    const { id } = req.params;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.getHistorical_locationByIDService(id);
    res.status(historical_location.status).json({ historical_location });
  }
}

import Container, { Service } from "typedi";
import Historical_locationService from "@/services/Historical_locationService";
import {
  IHistorical_locationDTO,
  Update_IHistorical_locationDTO,
} from "@/interfaces/IHistorical_location";

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
  //Get Historical_location by Governer_id
  public async getHistorical_locationByGovernerIDController(
    req: any,
    res: any
  ) {
    const Governer_id = req.params.governer_id;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.getHistorical_locationByGovernerIDService(
        Governer_id
      );
    res.status(historical_location.status).json({ historical_location });
  }
  //Update Historical_location
  public async updateHistorical_locationController(req: any, res: any) {
    const { id } = req.params;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const Historical_locationData = req.body as Update_IHistorical_locationDTO;
    const historical_location =
      await historical_locationService.updateHistorical_locationService(
        id,
        req.body
      );
    res.status(historical_location.status).json({ historical_location });
  }
  //Delete Historical_location
  public async deleteHistorical_locationController(req: any, res: any) {
    const { id } = req.params;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.deleteHistorical_locationService(id);
    res.status(historical_location.status).json({ historical_location });
  }
}

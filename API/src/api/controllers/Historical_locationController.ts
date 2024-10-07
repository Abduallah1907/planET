import Container, { Service } from "typedi";
import Historical_locationService from "@/services/Historical_locationService";
import {
  IHistorical_locationDTO,
  Update_IHistorical_locationDTO,
} from "@/interfaces/IHistorical_Location";
import { Types } from "mongoose";

@Service()
export class Historical_locationController {
  //Get all Historical Locations
  public async getAllHistorical_locationsController(req: any, res: any) {
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.getAllHistorical_locationsService();
    res.status(historical_location.status).json(historical_location);
  }
  public async createHistorical_locationController(req: any, res: any) {
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const Historical_locationData = req.body as IHistorical_locationDTO;
    const historical_location =
      await historical_locationService.createHistorical_locationService(
        Historical_locationData
      );
    res.status(historical_location.status).json(historical_location);
  }
  public async getHistorical_locationByIDController(req: any, res: any) {
    const { historical_location_id } = req.params;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.getHistorical_locationByIDService(
        historical_location_id
      );
    res.status(historical_location.status).json(historical_location);
  }
  //Get Historical_location by Governer_id
  public async getHistorical_locationsByGovernerIDController(
    req: any,
    res: any
  ) {
    const Governer_id = req.params.governer_id;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.getHistorical_locationsByGovernerIDService(
        Governer_id
      );
    res.status(historical_location.status).json(historical_location);
  }
  //Update Historical_location
  public async updateHistorical_locationController(req: any, res: any) {
    const { historical_location_id } = req.params;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const Historical_locationData = req.body as Update_IHistorical_locationDTO;
    const historical_location =
      await historical_locationService.updateHistorical_locationService(
        historical_location_id,
        Historical_locationData
      );
    res.status(historical_location.status).json(historical_location);
  }
  //Delete Historical_location
  public async deleteHistorical_locationController(req: any, res: any) {
    const { historical_location_id } = req.params;
    const historical_id = new Types.ObjectId(historical_location_id);
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_location =
      await historical_locationService.deleteHistorical_locationService(
        historical_id
      );
    res.status(historical_location.status).json(historical_location);
  }
  public async getSearchHistorical_location(req: any, res: any) {
    const { name, category, tag } = req.query;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const historical_locations =
      await historical_locationService.getSearchHistorical_locationService(
        name,
        category,
        tag
      );
    res.status(historical_locations.status).json(historical_locations);
  }
  public async getUpcomingHistorical_locations(req: any, res: any) {
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const upcomingHistorical_locations =
      await historical_locationService.getUpcomingHistorical_locationsService();
    res
      .status(upcomingHistorical_locations.status)
      .json(upcomingHistorical_locations);
  }
  public async getFilteredHistorical_locations(req: any, res: any) {
    const { tags } = req.query;
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    var filters = {};
    if (tags) {
      const tagsList = tags.split(",").map((tag: string) => tag.trim());
      filters = { ...filters, tags: tagsList };
    }
    const historical_locations =
      await historical_locationService.getFilteredHistorical_locationsService(
        filters
      );

    res.status(historical_locations.status).json(historical_locations);
  }
  public async getFilterComponents(req: any, res: any) {
    const historical_locationService: Historical_locationService =
      Container.get(Historical_locationService);
    const filterComponents =
      await historical_locationService.getFilterComponentsService();
    res.status(filterComponents.status).json(filterComponents);
  }
}

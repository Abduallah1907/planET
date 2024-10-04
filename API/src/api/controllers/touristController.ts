import {
  ITourist,
  ITouristCreateDTO,
  ITouristUpdateDTO,
} from "@/interfaces/ITourist";
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
import { start } from "repl";
@Service()
export class TouristController {
  public async getTourist(req: any, res: any) {
    const { email } = req.params;
    const touristService: TouristService = Container.get(TouristService);
    const tourist = await touristService.getTouristService(email);
    res.status(tourist.status).json({ tourist });
  }

  public async createTourist(req: any, res: any) {
    const touristData: ITouristCreateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const createdTourist = await touristService.createTouristService(
      touristData
    );
    res.status(createdTourist.status).json({ createdTourist });
  }

  public async updateTourist(req: any, res: any) {
    const { searchEmail } = req.params;
    const touristUpdateData: ITouristUpdateDTO = req.body;
    const touristService: TouristService = Container.get(TouristService);
    const updatedTourist = await touristService.updateTouristService(
      searchEmail,
      touristUpdateData
    );
    res.status(updatedTourist.status).json({ updatedTourist });
  }

  public async getItinerary(req: any, res: any) {
    const { name, category, tag } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const itineraries = await touristService.getItinerariesService(
      name,
      category,
      tag
    );
    res.status(itineraries.status).json({ itineraries });
  }

  public async getHistorical_locations(req: any, res: any) {
    const { name, category, tag } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    const historical_locations =
      await touristService.getHistorical_locationsService(name, category, tag);
    res.status(historical_locations.status).json({ historical_locations });
  }

  public async getUpcomingItineraries(req: any, res: any) {
    const touristService: TouristService = Container.get(TouristService);
    const upcomingItineraries =
      await touristService.getUpcomingItinerariesService();
    res.status(upcomingItineraries.status).json({ upcomingItineraries });
  }

  public async getUpcomingHistorical_locations(req: any, res: any) {
    const touristService: TouristService = Container.get(TouristService);
    const upcomingHistorical_locations =
      await touristService.getUpcomingHistorical_locationsService();
    res
      .status(upcomingHistorical_locations.status)
      .json({ upcomingHistorical_locations });
  }

  public async getFilteredItineraries(req: any, res: any) {
    const { budget, date, preferences } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    var filters = {};
    if (budget) {
      if (budget.includes("-")) {
        filters = {
          ...filters,
          price: {
            min: parseFloat(budget.split("-")[0]),
            max: parseFloat(budget.split("-")[1]),
          },
        };
      } else {
        filters = {
          ...filters,
          price: {
            max: parseFloat(budget),
          },
        };
      }
    }
    if (date) filters = { ...filters, date: { start: date } };
    if (preferences) {
      const preferencesList = preferences
        .split(",")
        .map((preference: string) => preference.trim());
      filters = { ...filters, preferences: preferencesList };
    }
    const itineraries = await touristService.getFilteredItinerariesService(
      filters
    );
    res.status(itineraries.status).json({ itineraries });
  }

  public async getFilteredHistorical_locations(req: any, res: any) {
    const { tags } = req.query;
    const touristService: TouristService = Container.get(TouristService);
    var filters = {};
    if (tags) {
      const tagsList = tags.split(",").map((tag: string) => tag.trim());
      filters = { ...filters, tags: tagsList };
    }
    const historical_locations =
      await touristService.getFilteredHistorical_locationsService(filters);

    res.status(historical_locations.status).json({ historical_locations });
  }
}

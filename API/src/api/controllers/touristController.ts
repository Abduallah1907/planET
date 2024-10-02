import { ITourist, ITouristCreateDTO, ITouristUpdateDTO } from "@/interfaces/ITourist";
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
@Service()
export class TouristController {
    public async getTourist(req: any, res: any) {
        const { email } = req.params;
        const touristService: TouristService = Container.get(TouristService);
        const tourist = await touristService.getTouristService(email);
        res.status(tourist.status).json({ tourist });
    };

    public async createTourist(req: any, res: any) {
        const touristData: ITouristCreateDTO = req.body;
        const touristService: TouristService = Container.get(TouristService);
        const createdTourist = await touristService.createTouristService(touristData);
        res.status(createdTourist.status).json({ createdTourist });
    };

    public async updateTourist(req: any, res: any) {
        const touristUpdateData: ITouristUpdateDTO = req.body;
        const touristService: TouristService = Container.get(TouristService);
        const updatedTourist = await touristService.updateTouristService(touristUpdateData);
        res.status(updatedTourist.status).json({ updatedTourist });
    };

    public async getActivities(req: any, res: any) {
        const { name, category, tag } = req.query;
        const touristService: TouristService = Container.get(TouristService);
        const activities = await touristService.getActivitiesService(name,category,tag);
        res.status(activities.status).json({ activities });
    };

    public async getItinerary(req: any, res: any) {
        const {name,category,tag} = req.query;
        const touristService: TouristService = Container.get(TouristService);
        const itineraries = await touristService.getItinerariesService(name,category,tag);
        res.status(itineraries.status).json({ itineraries });
    };

    public async getHistorical_locations(req: any, res: any) {
        const {name,category,tag} = req.query;
        const touristService: TouristService = Container.get(TouristService);
        const historical_locations = await touristService.getHistorical_locationsService(name,category,tag);
        res.status(historical_locations.status).json({ historical_locations });
    };

    public async getUpcomingActivities(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const upcomingActivities = await touristService.getUpcomingActivitiesService();
        console.log(upcomingActivities);

        res.status(upcomingActivities.status).json({ upcomingActivities });
    }

    public async getUpcomingItineraries(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const upcomingItineraries = await touristService.getUpcomingItinerariesService();
        res.status(upcomingItineraries.status).json({ upcomingItineraries });
    }
    
    public async getUpcomingHistorical_locations(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const upcomingHistorical_locations = await touristService.getUpcomingHistorical_locationsService();
        res.status(upcomingHistorical_locations.status).json({ upcomingHistorical_locations });
    }

    public async getFilteredActivities(req: any, res: any) {
        const {budget,date,category,ratings,} = req.query;
        const touristService: TouristService = Container.get(TouristService);
        const activities = await touristService.getFilteredActivitiesService(budget,date,category,ratings);
        res.status(activities.status).json({ activities });
    }
}

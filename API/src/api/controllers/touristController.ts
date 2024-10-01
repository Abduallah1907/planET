
import TouristService from "../../services/touristService";
import Container, { Inject, Service } from "typedi";
@Service()
export class TouristController {
    public async getTourist(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const tourist = await touristService.getTouristService(req.body.email);
        res.status(tourist.status).json({ tourist });
    };

    public async createTourist(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const createdTourist = await touristService.createTouristService(req.body.name, req.body.username, req.body.email, req.body.password, req.body.phone_number, req.body.job, req.body.nation, req.body.date_of_birth);
        res.status(createdTourist.status).json({ createdTourist });
    };

    public async updateTourist(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const updatedTourist = await touristService.updateTouristService(req.body.searchEmail, req.body.name, req.body.newEmail, req.body.password, req.body.phone_number, req.body.job, req.body.nation, req.body.addresses);
        res.status(updatedTourist.status).json({ updatedTourist });
    };

    public async getActivities(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const activities = await touristService.getActivitiesService(req.body.name, req.body.category, req.body.tag);
        res.status(activities.status).json({ activities });
    };

    public async getItinerary(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const itineraries = await touristService.getItinerariesService(req.body.name, req.body.category, req.body.tag);
        res.status(itineraries.status).json({ itineraries });
    };

    public async getHistorical_locations(req: any, res: any) {
        const touristService: TouristService = Container.get(TouristService);
        const historical_locations = await touristService.getHistorical_locationsService(req.body.name, req.body.category, req.body.tag);
        res.status(historical_locations.status).json({ historical_locations });
    };
}

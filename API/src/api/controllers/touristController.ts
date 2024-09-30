
import  TouristService  from "../../services/touristService";
import { Inject, Service } from "typedi";
@Service("touristController")
export class TouristController{
    constructor(
        @Inject('touristService') private touristService: TouristService
    ) {
    }



public async getTourist(req: any, res: any) {
    const tourist=await this.touristService.getTouristService(req.body.email);
    res.json({tourist});
};

public async createTourist(req: any, res: any){
    const createdTourist=await this.touristService.createTouristService(req.body.name,req.body.username,req.body.email,req.body.password,req.body.phone_number,req.body.job,req.body.nation,req.body.date_of_birth);
    res.json({createdTourist});
};

public async updateTourist(req: any, res: any){
    const updatedTourist= await this.touristService.updateTouristService(req.body.searchEmail,req.body.name,req.body.newEmail,req.body.password,req.body.phone_number,req.body.job,req.body.nation,req.body.addresses);
    res.json({updatedTourist});
};

public async getActivities(req: any, res: any){
    const activities= await this.touristService.getActivitiesService(req.body.name,req.body.category,req.body.tag);
    res.json({activities});
};

public async getItinerary (req: any, res: any){
    const itineraries= await this.touristService.getItinerariesService(req.body.name,req.body.category,req.body.tag);
    res.json({itineraries});
};

public async getHistorical_locations(req: any, res: any){
    const historical_locations= await this.touristService.getHistorical_locationsService(req.body.name,req.body.category,req.body.tag);
    res.json({historical_locations});
};
}

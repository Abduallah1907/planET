import AdvertiserService from "@/services/advertiserService";
import { IAdvertiser } from "../../interfaces/IAdvertiser";
import Container, { Service } from "typedi";

@Service()
export class AdvertiserController {
  //create Advertiser
  public async createAdvertiserController(req: any, res: any) {
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiserData = req.body as IAdvertiser;
    const advertiser = await advertiserService.createAdvertiserService(
      advertiserData
    );
    res.status(advertiser.status).json({ advertiser });
  }
  public async getAdvertiserByEmailController(req: any, res: any) {
    const { email } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByEmailService(
      email
    );
    res.status(advertiser.status).json({ advertiser });
  }
  //Get all Advertisers
  public async getAllAdvertisersController(req: any, res: any) {
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertisers = await advertiserService.getAllAdvertisersService();
    res.status(advertisers.status).json({ advertisers });
  }
  //Get Advertiser by ID
  public async getAdvertiserByIDController(req: any, res: any) {
    const { id } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByIDService(id);
    res.status(advertiser.status).json({ advertiser });
  }
  //Get Advertiser by User ID
  public async getAdvertiserByUserIDController(req: any, res: any) {
    const { userID } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByUserIDService(
      userID
    );
    res.status(advertiser.status).json({ advertiser });
  }
  //Get Advertiser by Activity ID
  public async getAdvertiserByActivityIDController(req: any, res: any) {
    const { activityID } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByActivityIDService(
      activityID
    );
    res.status(advertiser.status).json({ advertiser });
  }
  //Update Advertiser
  public async updateAdvertiserController(req: any, res: any) {
    const { email } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.updateAdvertiserService(
      email,
      req.body
    );
    res.status(advertiser.status).json({ advertiser });
  }
  //Delete Advertiser
  public async deleteAdvertiserController(req: any, res: any) {
    const { id } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.deleteAdvertiserService(id);
    res.status(advertiser.status).json({ advertiser });
  }
}

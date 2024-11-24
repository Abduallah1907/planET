import AdvertiserService from "@/services/advertiserService";
import { IAdvertiser, IAdvertiserMain } from "../../interfaces/IAdvertiser";
import Container, { Service } from "typedi";
import { Response, Request } from "express";

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
    res.status(advertiser.status).json(advertiser);
  }
  public async createAdvertiserMainController(req: any, res: any) {
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiserData = req.body as IAdvertiserMain;
    const advertiser = await advertiserService.createAdvertiserMainDataService(
      advertiserData
    );
    res.status(advertiser.status).json(advertiser);
  }

  public async getAdvertiserByEmailController(req: any, res: any) {
    const { email } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByEmailService(
      email
    );
    res.status(advertiser.status).json(advertiser);
  }
  //Get all Advertisers
  public async getAllAdvertisersController(req: any, res: any) {
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertisers = await advertiserService.getAllAdvertisersService();
    res.status(advertisers.status).json(advertisers);
  }
  //Get Advertiser by ID
  public async getAdvertiserByIDController(req: any, res: any) {
    const { id } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByIDService(id);
    res.status(advertiser.status).json(advertiser);
  }
  //Get Advertiser by User ID
  public async getAdvertiserByUserIDController(req: any, res: any) {
    const { userID } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByUserIDService(
      userID
    );
    res.status(advertiser.status).json(advertiser);
  }
  //Get Advertiser by Activity ID
  public async getAdvertiserByActivityIDController(req: any, res: any) {
    const { activityID } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.getAdvertiserByActivityIDService(
      activityID
    );
    res.status(advertiser.status).json(advertiser);
  }
  //Update Advertiser
  public async updateAdvertiserController(req: any, res: any) {
    const { email } = req.params;
    const file = req.file;

    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.updateAdvertiserService(
      email,
      file,
      req.body
    );
    res.status(advertiser.status).json(advertiser);
  }

  public async deleteAdvertiserAccountRequest(req: Request, res: Response) {
    const { email } = req.params;
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const advertiser = await advertiserService.deleteAdvertiserAccountRequest(
      email
    );
    res.status(advertiser.status).json(advertiser);
  }
  public async getSalesReport(req: Request, res: Response) {
    const advertiserService: AdvertiserService =
      Container.get(AdvertiserService);
    const { email } = req.params;
    const { start_date, end_date } = req.query;
    const salesReport = await advertiserService.getSalesReportService(
      email,
      start_date as string,
      end_date as string
    );
    res.status(salesReport.status).json(salesReport);
  }
}

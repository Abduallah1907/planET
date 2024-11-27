import {
  IPreviousWorkInputDTO,
  IPreviousWorkUpdateDTO,
} from "@/interfaces/IPrevious_work";
import TourGuideService from "@/services/tourGuideService";
import { Request, Response } from "express";
import Container, { Service } from "typedi";
import { Types } from "mongoose";
import {
  IItineraryCreateDTO,
  IItineraryUpdateDTO,
} from "@/interfaces/IItinerary";
import {
  ITour_GuideUpdateDTO,
  ITourGuideInput,
} from "@/interfaces/ITour_guide";

// TODO the user_id should be taken from the token, and not directly as input from the user
@Service()
export class TourGuideController {
  public async createPreviousWork(req: Request, res: Response): Promise<any> {
    const previousWorkData = req.body as IPreviousWorkInputDTO;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const newWorkExperience = await tourGuideService.createPreviousWorkService(
      previousWorkData
    );
    res.status(newWorkExperience.status).json(newWorkExperience);
  }

  public async updatePreviousWork(req: Request, res: Response): Promise<any> {
    const updatedPreviousWorkData = req.body as IPreviousWorkUpdateDTO;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const updatedPreviousWork =
      await tourGuideService.updatePreviousWorkService(updatedPreviousWorkData);
    res.status(updatedPreviousWork.status).json(updatedPreviousWork);
  }

  public async deletePreviousWork(req: Request, res: Response): Promise<any> {
    const { previous_work_id, tour_guide_user_id } = req.params;
    const _idObjectId = new Types.ObjectId(previous_work_id);
    const tour_guide_idObjectId = new Types.ObjectId(tour_guide_user_id);
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const deletedPreviousWork =
      await tourGuideService.deletePreviousWorkService(
        _idObjectId,
        tour_guide_idObjectId
      );
    res.status(deletedPreviousWork.status).json(deletedPreviousWork);
  }
  // ---- Profile ----
  public async createProfile(req: Request, res: Response): Promise<any> {
    const tourGuideData = req.body as ITourGuideInput;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const tourGuideProfile = await tourGuideService.createProfileService(
      tourGuideData
    );
    res.status(tourGuideProfile.status).json(tourGuideProfile);
  }
  public async getProfile(req: Request, res: Response): Promise<any> {
    const { email } = req.params;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const tourGuideProfile = await tourGuideService.getProfileService(email);
    res.status(tourGuideProfile.status).json(tourGuideProfile);
  }
  public async updateProfile(req: Request, res: Response): Promise<any> {
    const { email } = req.params;
    const tourGuideUpdatedData: ITour_GuideUpdateDTO = req.body;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const updatedProfile = await tourGuideService.updateProfileService(
      tourGuideUpdatedData,
      email
    );
    res.status(updatedProfile.status).json(updatedProfile);
  }

  public async deleteTourGuideAccountRequest(
    req: Request,
    res: Response
  ): Promise<any> {
    const { email } = req.params;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const deletionRequestResponse =
      await tourGuideService.deleteTourGuideAccountRequest(email);
    res.status(deletionRequestResponse.status).json(deletionRequestResponse);
  }
  public async getSalesReport(req: Request, res: Response): Promise<any> {
    const { email } = req.params;
    const { start_date, end_date } = req.query;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const salesReport = await tourGuideService.getSalesReportService(
      email,
      start_date as string,
      end_date as string
    );
    res.status(salesReport.status).json(salesReport);
  }
}

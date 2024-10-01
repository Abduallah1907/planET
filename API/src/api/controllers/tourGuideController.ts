import { IPreviousWorkInputDTO } from "@/interfaces/IPrevious_work";
import TourGuideService from "@/services/tourGuideService";
import { Request, Response } from "express";
import Container, { Service } from "typedi";

// TODO the user_id should be taken from the token, and not directly as input from the user
@Service()
export class TourGuideController {
  public async createPreviousWork(req: Request, res: Response): Promise<any> {
    const previousWorkData = req.body as IPreviousWorkInputDTO;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const newWorkExperience = await tourGuideService.createPreviousWorkService(previousWorkData);
    res.json({ newWorkExperience });
  }

  public async updatePreviousWork(req: Request, res: Response): Promise<any> {
    const { _id, title, place, from, to } = req.body;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const updatedPreviousWork = await tourGuideService.updatePreviousWorkService(_id, title, place, from, to);
    res.json({ updatedPreviousWork });
  }

  public async deletePreviousWork(req: Request, res: Response): Promise<any> {
    const { _id, tour_guide_id } = req.body;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const deletedPreviousWork = await tourGuideService.deletePreviousWorkService(_id, tour_guide_id);
    res.json(deletedPreviousWork);
  }
  // ---- Profile ----
  public async getProfile(req: Request, res: Response): Promise<any> {
    const { _id } = req.body;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const tourGuideProfile = await tourGuideService.getProfileService(_id);
    res.json({ tourGuideProfile });
  }
  public async updateProfile(req: Request, res: Response): Promise<any> {
    const { years_of_experience, previous_work_description, photo, user_id, tour_guide_id } = req.body;
    const tourGuideService: TourGuideService = Container.get(TourGuideService);
    const updatedProfile = tourGuideService.updateProfileService(years_of_experience, previous_work_description, photo, user_id);
    res.json({ updatedProfile });
  }
}

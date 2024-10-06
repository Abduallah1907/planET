import { IItineraryCreateDTO, IItineraryUpdateDTO } from "@/interfaces/IItinerary";
import { Request, Response } from "express";
import { Types } from "mongoose";
import ItineraryService from "@/services/itineraryService";
import Container, { Service } from "typedi";

@Service()
export class ItineraryController {
  public async createItinerary(req: Request, res: Response): Promise<any> {
    const itineraryData = req.body as IItineraryCreateDTO;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const newItinerary = await itineraryService.createItineraryService(itineraryData);
    res.json(newItinerary);
  }

  public async getItineraryByID(req: Request, res: Response): Promise<any> {
    const { itinerary_id } = req.params;
    const itinerary_idObjectId = new Types.ObjectId(itinerary_id);
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const newItinerary = await itineraryService.getItineraryByIDService(itinerary_idObjectId);
    res.json(newItinerary);
  }
  public async updateItinerary(req: Request, res: Response): Promise<any> {
    const itineraryData = req.body as IItineraryUpdateDTO;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const updatedItinerary = await itineraryService.updateItineraryService(itineraryData);
    res.json(updatedItinerary);
  }
  public async deleteItinerary(req: Request, res: Response): Promise<any> {
    const { tour_guide_user_id, itinerary_id } = req.params;
    const _idObjectId = new Types.ObjectId(itinerary_id);
    const tour_guide_idObjectId = new Types.ObjectId(tour_guide_user_id);
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const deletedItinerary = await itineraryService.deleteItineraryService(tour_guide_idObjectId, _idObjectId);
    res.json(deletedItinerary);
  }

  public async getAllItinerariesByTourGuideID(req: Request, res: Response): Promise<any> {
    const { tour_guide_user_id } = req.params;
    const tour_guide_idObjectId = new Types.ObjectId(tour_guide_user_id);
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const itineraries = await itineraryService.getAllItinerariesByTourGuideIDService(tour_guide_idObjectId);
    res.json(itineraries);
  }

  public async getAllItineraries(req: Request, res: Response): Promise<any> {
    const { page } = req.params;
    const pageNum: number = parseInt(page);
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const itineraries = await itineraryService.getAllItineraries(pageNum);
    res.json(itineraries);
  }
}

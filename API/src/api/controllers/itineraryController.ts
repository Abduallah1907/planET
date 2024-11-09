import {
  IItineraryCreateDTO,
  IItineraryUpdateDTO,
} from "@/interfaces/IItinerary";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import ItineraryService from "@/services/itineraryService";
import Container, { Service } from "typedi";
import UserRoles from "@/types/enums/userRoles";

@Service()
export class ItineraryController {
  public async createItinerary(req: Request, res: Response): Promise<any> {
    const itineraryData = req.body as IItineraryCreateDTO;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const newItinerary = await itineraryService.createItineraryService(
      itineraryData
    );
    res.status(newItinerary.status).json(newItinerary);
  }

  public async getItineraryByID(req: Request, res: Response): Promise<any> {
    const { itinerary_id } = req.params;
    const itinerary_idObjectId = new Types.ObjectId(itinerary_id);
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const newItinerary = await itineraryService.getItineraryByIDService(
      itinerary_idObjectId
    );
    res.status(newItinerary.status).json(newItinerary);
  }
  public async updateItinerary(req: Request, res: Response): Promise<any> {
    const { itinerary_id } = req.params;
    const itinerary_idObjectId = new Types.ObjectId(itinerary_id);

    const itineraryData = req.body as IItineraryUpdateDTO;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const updatedItinerary = await itineraryService.updateItineraryService(
      itinerary_idObjectId,
      itineraryData
    );
    res.status(updatedItinerary.status).json(updatedItinerary);
  }

  public async deleteItinerary(req: Request, res: Response): Promise<any> {
    const { itinerary_id } = req.params;
    const itinearary_id_object = new Types.ObjectId(itinerary_id);
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const deletedItinerary = await itineraryService.deleteItineraryService(
      itinearary_id_object
    );
    res.status(deletedItinerary.status).json(deletedItinerary);
  }

  // public async deactivateItinerary(req: Request, res: Response): Promise<any> {
  //   const { itinerary_id } = req.params;
  //   const itinerary_idObjectId = new Types.ObjectId(itinerary_id);

  //   const itineraryService: ItineraryService = Container.get(ItineraryService);
  //   const updatedItinerary = await itineraryService.deactivateItineraryService(itinerary_idObjectId);
  //   res.status(updatedItinerary.status).json(updatedItinerary);
  // }
  // public async activateItinerary(req: Request, res: Response): Promise<any> {
  //   const { itinerary_id } = req.params;
  //   const itinerary_idObjectId = new Types.ObjectId(itinerary_id);

  //   const itineraryService: ItineraryService = Container.get(ItineraryService);
  //   const updatedItinerary = await itineraryService.activateItineraryService(itinerary_idObjectId);
  //   res.status(updatedItinerary.status).json(updatedItinerary);
  // }

  public async flagItinerary(req: Request, res: Response): Promise<any> {
    const { itinerary_id } = req.params;
    const itinerary_idObjectId = new Types.ObjectId(itinerary_id);

    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const updatedItinerary =
      await itineraryService.flagItineraryInappropriateService(
        itinerary_idObjectId
      );
    res.status(updatedItinerary.status).json(updatedItinerary);
  }

  public async getAllItinerariesByTourGuideID(
    req: Request,
    res: Response
  ): Promise<any> {
    const { tour_guide_id } = req.params;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const itineraries =
      await itineraryService.getAllItinerariesByTourGuideIDService(
        tour_guide_id
      );
    res.status(itineraries.status).json(itineraries);
  }

  public async getAllItineraries(req: Request, res: Response): Promise<any> {
    const { page } = req.params;
    const { role } = req.body;
    const pageNum: number = parseInt(page);
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const itineraries = await itineraryService.getAllItinerariesService(
      pageNum,
      role
    );
    res.status(itineraries.status).json(itineraries);
  }
  public async getSearchItinerary(req: any, res: any) {
    const { name, category, tag } = req.query;
    const { role } = req.body;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const itineraries = await itineraryService.getSearchItineraryService(
      name,
      category,
      tag,
      role
    );
    res.status(itineraries.status).json(itineraries);
  }
  public async getUpcomingItineraries(req: any, res: any) {
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const { role } = req.body;
    const upcomingItineraries =
      await itineraryService.getUpcomingItinerariesService(role);
    res.status(upcomingItineraries.status).json(upcomingItineraries);
  }
  public async getFilteredItineraries(req: any, res: any) {
    const { price, date, tag, language, tour_guide_id } = req.query;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    var filters = {};
    if (price) {
      if (price.includes("-")) {
        filters = {
          ...filters,
          price: {
            min: parseFloat(price.split("-")[0]),
            max: parseFloat(price.split("-")[1]),
          },
        };
      } else {
        filters = {
          ...filters,
          price: {
            max: parseFloat(price),
          },
        };
      }
    }
    if (date) {
      const [start, end] = date.split("-");
      filters = { ...filters, date: { start: start, end: end } };
    }
    if (tag) {
      const preferencesList = tag
        .split(",")
        .map((preference: string) => preference.trim());
      filters = { ...filters, preferences: preferencesList };
    }
    if (language) {
      const languages = language.split(",").map((lang: string) => lang.trim());
      filters = { ...filters, languages: languages };
    }
    if (tour_guide_id) filters = { ...filters, tour_guide_id: tour_guide_id };
    const { role } = req.body;
    const itineraries = await itineraryService.getFilteredItinerariesService(
      filters,
      role
    );
    res.status(itineraries.status).json(itineraries);
  }
  public async getSortedItineraries(req: any, res: any) {
    const { sort, direction } = req.query;
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const { role } = req.body;
    const itineraries = await itineraryService.getSortedItinerariesService(
      sort,
      direction,
      role
    );
    res.status(itineraries.status).json(itineraries);
  }
  public async getFilterComponents(req: any, res: any) {
    const itineraryService: ItineraryService = Container.get(ItineraryService);
    const { role } = req.body;
    const filterComponent = await itineraryService.getFilterComponentsService(
      role
    );
    res.status(filterComponent.status).json(filterComponent);
  }
}

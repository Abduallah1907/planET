import SkyscannerService from "@/services/skyscannerService";
import Container, { Service } from "typedi";
import { Request, Response } from 'express';

@Service()
export default class SkyscannerController {

    public async getLocationsBykeyword(req: any, res: any) {
        const { keyword } = req.query;
        const skyscannerService = Container.get(SkyscannerService);
        const response = await skyscannerService.getLocationsService(keyword);
        res.status(200).send(response);
    }

}
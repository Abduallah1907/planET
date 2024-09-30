import SellerService from "@/services/sellerService";
import { ISellerInputDTO } from "@/interfaces/ISeller";
import Container, { Inject, Service } from "typedi";

@Service()
export class SellerController {

    public async getSeller(req: any, res: any) {
        const sellerService: SellerService = Container.get(SellerService);
        const seller = await sellerService.getSellerService(req.body.email)
        res.status(seller.status).json({seller});
    };
    
    public async createSeller(req: any, res: any) {
        const sellerService: SellerService = Container.get(SellerService);
        const sellerData = req.body as ISellerInputDTO;
        const seller = await sellerService.createSellerService(sellerData)
        res.status(seller.status).json({seller});
    };
    public async updateSeller(req: any, res: any) {
        const sellerService: SellerService = Container.get(SellerService);
        const seller = await sellerService.updateSellerService(req.body.email,req.body.name,req.body.description)
        res.status(seller.status).json({seller});
    }
}


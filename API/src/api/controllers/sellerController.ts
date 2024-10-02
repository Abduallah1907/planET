import SellerService from "@/services/sellerService";
import { ISellerInputDTO } from "@/interfaces/ISeller";
import Container, { Inject, Service } from "typedi";
import { ISellerUpdateDTO } from "@/interfaces/ISeller";

@Service()
export class SellerController {

    public async getSeller(req: any, res: any) {
        const {email}=req.params;
        const sellerService: SellerService = Container.get(SellerService);
        const seller = await sellerService.getSellerService(email)
        res.status(seller.status).json({seller});
    };
    
    public async createSeller(req: any, res: any) {
        const sellerService: SellerService = Container.get(SellerService);
        const newSellerData = req.body as ISellerInputDTO;
        const seller = await sellerService.createSellerService(newSellerData)
        res.status(seller.status).json({seller});
    };
    public async updateSeller(req: any, res: any) {
        const sellerService: SellerService = Container.get(SellerService);
        const updateSellerData = req.body as ISellerUpdateDTO;
        const seller = await sellerService.updateSellerService(updateSellerData)
        res.status(seller.status).json({seller});
    }
}


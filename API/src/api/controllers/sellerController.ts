import SellerService from "@/services/sellerService";
import { ISellerInputDTO } from "@/interfaces/ISeller";
import { Inject, Service } from "typedi";

@Service('sellerController')
export class SellerController {
    constructor(
        @Inject('sellerService') private sellerService: SellerService
    ) {
    }
    public async getSeller(req: any, res: any) {
        const seller = await this.sellerService.getSellerService(req.body.email)
        res.json({seller})
    };
    
    public async createSeller(req: any, res: any) {
        const sellerData = req.body as ISellerInputDTO;
        const seller = await this.sellerService.createSellerService(sellerData)
        res.json({seller})
    };
    public async updateSeller(req: any, res: any) {
        const seller = await this.sellerService.updateSellerService(req.body.email,req.body.name,req.body.description)
        res.json({seller});
    }
}


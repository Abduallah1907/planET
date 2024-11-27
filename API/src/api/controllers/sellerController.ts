import SellerService from "@/services/sellerService";
import { ISellerInputDTO } from "@/interfaces/ISeller";
import Container, { Inject, Service } from "typedi";
import { ISellerUpdateDTO } from "@/interfaces/ISeller";
import { Request, Response } from "express";

@Service()
export class SellerController {
  public async getSeller(req: any, res: any) {
    const { email } = req.params;
    const sellerService: SellerService = Container.get(SellerService);
    const seller = await sellerService.getSellerService(email);
    res.status(seller.status).json(seller);
  }

  public async createSeller(req: any, res: any) {
    const sellerService: SellerService = Container.get(SellerService);
    const newSellerData = req.body as ISellerInputDTO;
    const seller = await sellerService.createSellerService(newSellerData);
    res.status(seller.status).json(seller);
  }
  public async updateSeller(req: any, res: any) {
    const sellerService: SellerService = Container.get(SellerService);
    const { searchEmail } = req.params;
    const updateSellerData = req.body as ISellerUpdateDTO;
    const seller = await sellerService.updateSellerService(
      searchEmail,
      updateSellerData
    );
    res.status(seller.status).json(seller);
  }

  public async deleteSellerAccountRequest(req: Request, res: Response) {
    const { email } = req.params;
    const sellerService: SellerService = Container.get(SellerService);
    const seller = await sellerService.deleteSellerAccountRequest(email);
    res.status(seller.status).json(seller);
  }
  public async getSalesReport(req: Request, res: Response) {
    const sellerService: SellerService = Container.get(SellerService);
    const { email } = req.params;
    const { start_date, end_date } = req.query;
    const seller = await sellerService.getSalesReportService(
      email,
      start_date as string,
      end_date as string
    );
    res.status(seller.status).json(seller);
  }
}

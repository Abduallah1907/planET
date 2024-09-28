import {getSellerService,createSellerService,updateSellerService} from "../services/sellerService";

export const getSeller = async (req: any, res: any) => {getSellerService(req,res);};
export const createSeller = async (req: any, res: any) => {createSellerService(req,res)};
export const updateSeller = async (req: any, res: any) => {updateSellerService(req,res)};



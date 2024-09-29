import {getSellerService,createSellerService,updateSellerService} from "../../services/sellerService";

export const getSeller = async (req: any, res: any) => {getSellerService(req.body.email)};
export const createSeller = async (req: any, res: any) => {createSellerService(req.body.documents_required,req.body.logo,req.body.name,req.body.username,req.body.email,req.body.password,req.body.phone_number)};
export const updateSeller = async (req: any, res: any) => {updateSellerService(req.body.email,req.body.name,req.body.description)};



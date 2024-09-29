import {getSellerService,createSellerService,updateSellerService} from "../../services/sellerService";

export const getSeller = async (req: any, res: any) => {
    const seller = await getSellerService(req.body.email)
    res.json({seller})
};
    
export const createSeller = async (req: any, res: any) => {
    const seller = await createSellerService(req.body.documents_required,req.body.logo,req.body.name,req.body.username,req.body.email,req.body.password,req.body.phone_number)
    res.json({seller})

};
export const updateSeller = async (req: any, res: any) => {
    const seller = await updateSellerService(req.body.email,req.body.name,req.body.description)
    res.json({seller});
}


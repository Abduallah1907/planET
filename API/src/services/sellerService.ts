import moongose from "@/loaders/moongose";
import Seller from "../models/Seller";



export const getSellerService = async (req: any, res: any) => {
    try{
        const seller = await Seller.find({});
        res.status(200).json(seller);
    }catch{
        res.status(404).json({message: "Error"});
    }

    
};
export const createSellerService = async (req: any, res: any) => {};
export const updateSellerService = async (req: any, res: any) => {};
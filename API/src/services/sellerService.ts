import mongoose from "mongoose";
import Seller from "../models/Seller";
import { createUserService } from "./userService";
import User from "../models/user";
import { ISellerOutputDTO } from "../interfaces/ISeller";


//input email of seller retrun seller data
export const getSellerService = async (req: any, res: any) => {
    //rename email to sellerEmail for DTO conversion
    const { email: sellerEmail }: { email: string } = req.body;

        const user = await User.findOne({ email: sellerEmail, role: "seller" });
        
        if (user == null) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }
        const seller = await Seller.findOne({ user_id: user._id });
        if (seller == null) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        const sellerOutput: ISellerOutputDTO = {
            email: user.email,
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            logo: seller.logo,
            description: seller.description
        };
        return res.status(200).json({ success: true, data: sellerOutput });
    
};
//Any seller need to be cerated as a user first role seller so we need to call createUserService first then seller will be created
export const createSellerService = async (req: any, res: any) => {
    const {documents_required,logo} = req.body;

        const newUser = await createUserService(req,res);
        
        newUser.data.role="seller";
        console.log(newUser);
        newUser.data.save();

        const newSeller = new Seller({user_id:newUser.data._id,documents_required:documents_required,logo:logo});
        console.log("seller made");
        console.log(newSeller);
        await newSeller.save();
        console.log("seller saved");



        const sellerOutput: ISellerOutputDTO = {
            email: newUser.data.email,
            name: newUser.data.name,
            username: newUser.data.username,
            phone_number: newUser.data.phone_number,
            logo: newSeller.logo,
            description: newSeller.description
        };
        return res.status(201).json({success:true, data:sellerOutput});

};

//Takes old and new name and description of seller
export const updateSellerService = async (req: any, res: any) => {
    const {email,name,description} = req.body;
    const user = await User.findOne({email,role:"seller"});
        if(user==null){
            return res.status(404).json({success:false, message: "User not found"});
        }
        user.name=name;
        user.save();//Update name of user and put in db
        const updatedSeller =await Seller.findOneAndUpdate({user_id:user._id},{description:description},{new:true});
        if(updatedSeller==null){
            return res.status(404).json({success:false, message: "Seller not found"});
        }
        const sellerOutput: ISellerOutputDTO = {
            email: user.email,
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            logo: updatedSeller.logo,
            description: updatedSeller.description
        };
        return res.status(200).json({ success: true, data: sellerOutput });
  
    
};
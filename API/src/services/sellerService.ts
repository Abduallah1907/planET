import mongoose from "mongoose";
import Seller from "../models/Seller";
import { createUserService } from "./userService";
import User from "../models/user";
import { ISellerOutputDTO } from "../interfaces/ISeller";
import UserRoles from "@/types/enums/userRoles";
import responce from "@/types/responces/responce";

//input email of seller retrun seller data
export const getSellerService = async (email:string) => {
    //rename email to sellerEmail for DTO conversion

        const user = await User.findOne({ email: email, role: UserRoles.Seller });
        if(user==null){
            throw new Error("User not found");
        }
      
        const seller = await Seller.findOne({ user_id: user._id });
       if(seller==null){
           throw new Error("Seller not found");
       }

        const sellerOutput: ISellerOutputDTO = {
            email: user.email,
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            logo: seller.logo,
            description: seller.description
        };
        return new responce(true, sellerOutput, "Seller found", 200);
    
};
//Any seller need to be cerated as a user first role seller so we need to call createUserService first then seller will be created
export const createSellerService = async (documents_required:string,logo:string,name:string,username:string,email:string,password:string,phone_number:string) => {
        const newUser = await createUserService(name,username,email,password,phone_number);
        
        newUser.data.role=UserRoles.Seller;
        newUser.data.save();

        const newSeller = new Seller({user_id:newUser.data._id,documents_required:documents_required,logo:logo});
       
        await newSeller.save();
    



        const sellerOutput: ISellerOutputDTO = {
            email: newUser.data.email,
            name: newUser.data.name,
            username: newUser.data.username,
            phone_number: newUser.data.phone_number,
            logo: newSeller.logo,
            description: newSeller.description
        };
        return new responce(true, sellerOutput, "Seller created", 200);

};

//Takes old and new name and description of seller
export const updateSellerService = async (email:string,name:string,description:string) => {
    const user = await User.findOne({email,role:"seller"});
        if(user==null){
            throw new Error("User not found");
        }
        user.name=name;
        user.save();//Update name of user and put in db
        const updatedSeller =await Seller.findOneAndUpdate({user_id:user._id},{description:description},{new:true});
        if(updatedSeller==null){
            throw new Error("Seller not found");    
        }
        const sellerOutput: ISellerOutputDTO = {
            email: user.email,
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            logo: updatedSeller.logo,
            description: updatedSeller.description
        };
        return new responce(true, sellerOutput, "Seller updated", 200);
  
    
};
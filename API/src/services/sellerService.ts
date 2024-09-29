import mongoose from "mongoose";
import Seller from "../models/Seller";
import { createUserService } from "./userService";
import User from "../models/user";
import { ISellerOutputDTO } from "../interfaces/ISeller";
import UserRoles from "@/types/enums/userRoles";
import response from "@/types/responses/response";
import { HttpError, InternalServerError } from "@/types/Errors";

//input email of seller retrun seller data
export const getSellerService = async (email:string) => {
    //rename email to sellerEmail for DTO conversion

        const user = await User.findOne({ email: email, role: UserRoles.Seller });
        if(user instanceof Error)
            // throw new InternalServerError("Internal server error");
            throw new Error ("Internal server error");

        if(user==null)
            // throw new HttpError("User not found",404);
            throw new Error("User not found");
        
        
        
        
        const seller = await Seller.findOne({ user_id: user._id });
        if(seller==null)
        // throw new HttpError("Seller not found",404);    
        throw new Error("Seller not found");

        
        if(seller instanceof Error)
        // throw new InternalServerError("Internal server error");
        throw new Error("Internal server error");
        

        const sellerOutput: ISellerOutputDTO = {
            email: user.email,
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            logo: seller.logo,
            description: seller.description
        };
        return new response(true, sellerOutput, "Seller found", 200);
    
};
//Any seller need to be cerated as a user first role seller so we need to call createUserService first then seller will be created
export const createSellerService = async (documents_required:string,logo:string,name:string,username:string,email:string,password:string,phone_number:string) => {
        const newUser = await createUserService(name,username,email,password,phone_number);
        newUser.data.role=UserRoles.Seller;
        newUser.data.save();
        if(newUser instanceof Error)
            throw new InternalServerError("Internal server error");
        
        if(newUser.data==null)
            throw new HttpError("User not created",404);
        
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
        return new response(true, sellerOutput, "Seller created", 201);

};

//Takes old and new name and description of seller
export const updateSellerService = async (email:string,name:string,description:string) => {
    const user = await User.findOne({email,role:"seller"});
        if(user instanceof Error)
            throw new InternalServerError("Internal server error");
        if(user==null)
            throw new HttpError("User not found",404);
        
        
        
        user.name=name;
        user.save();//Update name of user and put in db
        const updatedSeller =await Seller.findOneAndUpdate({user_id:user._id},{description:description},{new:true});

        if(updatedSeller instanceof Error)
            throw new InternalServerError("Internal server error");
        if(updatedSeller==null)
            throw new HttpError("Seller not found",404);  
        
        
        
        const sellerOutput: ISellerOutputDTO = {
            email: user.email,
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            logo: updatedSeller.logo,
            description: updatedSeller.description
        };
        return new response(true, sellerOutput, "Seller updated", 200);
  
    
};
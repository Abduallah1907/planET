
import mongoose from "mongoose";
import User from "../models/user";


export const getUserService = async (req: any, res: any) => {
    const {email} = req.body;

    const user = await User.find({email});
    if(user==null){
        return res.status(404).json({success:false, message: "User not found"});
    }
    return res.status(200).json({success:true, data: user});

};
export const createUserService = async (req: any, res: any) => {
    const {name,username,email,password,phone_number} = req.body;

    const newUser = new User({name,username,email,password,phone_number});
    await newUser.save();
    const response = { success: true, data: newUser };
    return response;     


};
export const updateUserService = async (req: any, res: any) => {
    const{oldEmail,newEmail} = req.body;
    const newUser = await User.findOneAndUpdate({oldEmail},{newEmail},{new:true});
    if(newUser==null){
        return res.status(404).json({success:false, message: "User not found"});
    }
    return res.status(200).json({success:true, data: newUser});

};
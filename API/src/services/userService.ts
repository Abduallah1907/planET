
import mongoose from "mongoose";
import User from "../models/user";


export const createUserService = async (name:string,username:string,email:string,password:string,phone_number:string) => {

    const newUser = new User({name,username,email,password,phone_number});
    await newUser.save();
    const response = { success: true, data: newUser };
    return response;     


};

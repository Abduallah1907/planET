
import mongoose from "mongoose";
import User from "../models/user";
import { HttpError, InternalServerError } from "../types/Errors";
import responce from "../types/responces/responce";


export const createUserService = async (name:string,username:string,email:string,password:string,phone_number:string) => {

    const newUser = new User({name,username,email,password,phone_number});
    if(newUser instanceof Error)
        // throw new InternalServerError("Internal server error");
        throw new Error ("Internal server error");
    if(newUser==null)
        // throw new HttpError("User not created",404);
        throw new Error("User not created");
    await newUser.save();
    const response = new responce(true, newUser, "User created", 201);
    return response;     


};

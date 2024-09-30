
import mongoose from "mongoose";
import User from "../models/user";
import { HttpError, InternalServerError } from "../types/Errors";
import response from "../types/responses/response";

export const createUserService = async (name:string,username:string,email:string,password:string,phone_number:string,date_of_birth:Date) => {

    const newUser = new User({name,username,email,password,phone_number,date_of_birth});
    if(newUser instanceof Error)
        throw new InternalServerError("Internal server error");
        // throw new Error ("Internal server error");
    if(newUser==null)
        throw new HttpError("User not created",404);
        // throw new Error("User not created");
    await newUser.save();
    return new response(true, newUser, "User created", 200);

};

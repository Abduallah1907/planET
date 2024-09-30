import { HttpError, InternalServerError } from "@/types/Errors";
import  Tourist  from "../models/Tourist";
import { ITouristOutputDTO } from "@/interfaces/ITourist";
import User from "@/models/user";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import { createUserService } from "./userService";


export const getTouristService = async (email:string) => {
    const user = await User.findOne({email:email,role:UserRoles.Tourist});
    if(user instanceof Error)
        throw new InternalServerError("Internal server error");

    if(user==null)
        throw new HttpError("Tourist not found",404);

    const tourist = await Tourist.findOne({user_id:user._id});

    if(tourist instanceof Error)
        throw new InternalServerError("Internal server error");

    if(tourist==null)  
        throw new HttpError("User not found",404);

    const touristOutput: ITouristOutputDTO = {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        phone_number: user.phone_number,
        status: user.status,
        date_of_birth: tourist.date_of_birth,//May be changed
        job: tourist.job,
        nation: tourist.nation,
        wallet: tourist.wallet,
        loyality_points: tourist.loyality_points,
        badge: tourist.badge,
        addresses: tourist.addresses,
        // cart: tourist.cart,
        // wishlist: tourist.wishlist,//out of current scope of sprint
    };
    return new response(true, touristOutput, "Tourist found", 200);
};

    
export const createTouristService = async (name:string,username:string,email:string,password:string,phone_number:string,job:string,nation:string,date_of_birth:Date) => {
    const newUserResponse = await createUserService(name,username,email,password,phone_number);
    console.log(nation);
    console.log(date_of_birth);
    const newUser = new User(newUserResponse.data);
    newUser.role=UserRoles.Tourist;
    await newUser.save();
    if(newUser instanceof Error)
        throw new InternalServerError("Internal server error");
    
    if(newUser==null)
        throw new HttpError("User not created",404);


    const newTourist = new Tourist({user_id:newUser._id,date_of_birth:date_of_birth,job:job,nation:nation});
    await newTourist.save();
    if (newTourist instanceof Error)
        throw new InternalServerError("Internal server error");

    if(newTourist==null)
        throw new HttpError("Tourist not created",404);

    const touristOutput: ITouristOutputDTO = {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        phone_number: newUser.phone_number,
        status: newUser.status,
        date_of_birth: newTourist.date_of_birth,//May be changed
        job: newTourist.job,
        nation: newTourist.nation,
        wallet: newTourist.wallet,
        loyality_points: newTourist.loyality_points,
        badge: newTourist.badge,
        addresses: newTourist.addresses,
        // cart: newTourist.cart,
        // wishlist: newTourist.wishlist,//out of current scope of sprint
    };
    console.log(touristOutput);
    return new response(true, touristOutput, "Tourist created", 201);
    
}

export const updateTouristService = async (searchEmail:string,name:string,newEmail:string,password:string,phone_number:string,job:string,nation:string,addresses:[string]) => {
    const user = await User.findOneAndUpdate({email:searchEmail,role:UserRoles.Tourist},{name:name,email:newEmail,password:password,phone_number:phone_number},{new:true});
    if(user instanceof Error)
        throw new InternalServerError("Internal server error");

    if(user==null)
        throw new HttpError("Tourist not found",404);

    const tourist = await Tourist.findOneAndUpdate({user_id:user._id},{job:job,nation:nation,addresses:addresses},{new:true});

    if(tourist instanceof Error)
        throw new InternalServerError("Internal server error");

    if(tourist==null)  
        throw new HttpError("User not found",404);


    const touristOutput: ITouristOutputDTO = {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        phone_number: user.phone_number,
        status: user.status,
        date_of_birth: tourist.date_of_birth,//May be changed
        job: tourist.job,
        nation: tourist.nation,
        wallet: tourist.wallet,
        loyality_points: tourist.loyality_points,
        badge: tourist.badge,
        addresses: tourist.addresses,

        // cart: tourist.cart,
        // wishlist: tourist.wishlist,//out of current scope of sprint
    };

    return new response(true, touristOutput, "Tourist updated", 200);



};

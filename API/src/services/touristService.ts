import { HttpError, InternalServerError } from "@/types/Errors";
import  Tourist  from "../models/Tourist";
import { ITouristOutputDTO } from "@/interfaces/ITourist";
import User from "@/models/user";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import { createUserService } from "./userService";
import Itinerary from "@/models/Itinerary";
import Historical_Location from "@/models/Historical_location";
import Activity from "@/models/Activity";



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
        date_of_birth: user.date_of_birth,//May be changed
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
    const newUserResponse = await createUserService(name,username,email,password,phone_number,date_of_birth);
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
        date_of_birth: newUser.date_of_birth,//May be changed
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
    
};

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
        date_of_birth: user.date_of_birth,//May be changed
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

export const getActivitiesService = async (name:string,category:string,tag:string) => {


    // const newCategory = new Category({type:category});
    // await newCategory.save();
    // const newActivity = new Activity({
    //     category: newCategory._id,
    //     name: name,
    //     tags: [tag],
    // });
    // await newActivity.save();

    // console.log(newCategory);
    // console.log(newActivity);

    const activities = await Activity.find({name:name,tags:tag}).populate({path: 'category', match: { type: category }});

    if(activities instanceof Error)
        throw new InternalServerError("Internal server error");
    
    if(activities==null)
        throw new HttpError("Activities not found",404);
    


    return new response(true, activities, "Fetched activities", 200);
}

export const getItinerariesService = async (name:string,category:string,tag:string) => {
    const itineraries = await Itinerary.find({name:name,tags:tag}).populate({path: 'category', match: { type: category }});
    if(itineraries instanceof Error)
        throw new InternalServerError("Internal server error");

    if(itineraries==null)
        throw new HttpError("Itineraries not found",404);
    return new response(true, itineraries, "Fetched itineraries", 200);
}

export const getHistorical_locationsService = async (name:string,category:string,tag:string) => {
    const historical_locations = await Historical_Location.find({name:name,tags:tag}).populate({path: 'category', match: { type: category }});
    if(historical_locations instanceof Error)
        throw new InternalServerError("Internal server error");

    if(historical_locations==null)
        throw new HttpError("Historical locations not found",404);

    return new response(true, historical_locations, "Fetched historical locations", 200);
}


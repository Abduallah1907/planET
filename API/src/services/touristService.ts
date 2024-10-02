import { BadRequestError, InternalServerError, NotFoundError } from "@/types/Errors";
import { ITouristCreateDTO, ITouristNewUserDTO, ITouristOutputDTO, ITouristUpdateDTO } from "@/interfaces/ITourist";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";

import Container, { Inject, Service } from "typedi";
import UserService from "./userService";
import { name } from "agenda/dist/agenda/name";


@Service()
export default class TouristService {
    constructor(
        @Inject("touristModel") private touristModel: Models.TouristModel,
        @Inject("userModel") private userModel: Models.UserModel,
        @Inject("activityModel") private activityModel: Models.ActivityModel,
        @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
        @Inject("historical_locationModel") private historical_locationsModel: Models.Historical_locationsModel,
    ) {
    }

    public async getTouristService(email: string) {
        const user = await this.userModel.findOne({ email: email, role: UserRoles.Tourist });
        if (user instanceof Error)
            throw new InternalServerError("Internal server error");

        if (user == null)
            throw new NotFoundError("User not found");

        const tourist = await this.touristModel.findOne({ user_id: user._id });
        if (tourist instanceof Error)
            throw new InternalServerError("Internal server error");

        if (tourist == null)
            throw new NotFoundError("Tourist not found");

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

    public async createTouristService(touristData: ITouristCreateDTO) {
        const IUserInputDTO = {
            email: touristData.email,
            name: touristData.name,
            username: touristData.username,
            password: touristData.password,
            role: UserRoles.Tourist,
            phone_number: touristData.phone_number,
            date_of_birth: touristData.date_of_birth
        }
        const userService: UserService = Container.get(UserService);
        const newUserResponse = await userService.createUserService(IUserInputDTO);
        const newUser = new this.userModel(newUserResponse.data);
        newUser.role = UserRoles.Tourist;
        await newUser.save();
        if (newUser instanceof Error)
            throw new InternalServerError("Internal server error");

        const newTouristData: ITouristNewUserDTO = {
            user_id: newUser._id,
            date_of_birth: touristData.date_of_birth,
            job: touristData.job,
            nation: touristData.nation,
        }
        const newTourist = new this.touristModel(newTouristData);
        await newTourist.save();
        if (newTourist instanceof Error)
            throw new InternalServerError("Internal server error");

        if (newTourist == null)
            throw new NotFoundError("Tourist not found");

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

    };

    public async updateTouristService(touristUpdateData: ITouristUpdateDTO) {
        const phoneNumRegex = /^\+\d{1,3}[\s-]?(\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9})$/;
        if (!phoneNumRegex.test(touristUpdateData.phone_number))
            throw new BadRequestError("Invalid phone number");
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(touristUpdateData.searchEmail))
            throw new BadRequestError("Invalid inputted email");
        if (!emailRegex.test(touristUpdateData.newEmail))
            throw new BadRequestError("Invalid new email");
        const updatedUserData = {
            name: touristUpdateData.name,
            email: touristUpdateData.newEmail,
            password: touristUpdateData.password,
            phone_number: touristUpdateData.phone_number,
        }
        const user = await this.userModel.findOneAndUpdate(
            { email: touristUpdateData.searchEmail, role: UserRoles.Tourist }, updatedUserData, { new: true });
        if (user instanceof Error)
            throw new InternalServerError("Internal server error");

        if (user == null)
            throw new NotFoundError("User not found");

        const updatedTouristData = {
            job: touristUpdateData.job,
            nation: touristUpdateData.nation,
            addresses: touristUpdateData.addresses,
        }
        const tourist = await this.touristModel.findOneAndUpdate({ user_id: user._id }, updatedTouristData, { new: true });

        if (tourist instanceof Error)
            throw new InternalServerError("Internal server error");

        if (tourist == null)
            throw new NotFoundError("Tourist not found");


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

    public async getActivitiesService(name: string, category: string, tag: string) {


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

        const activities = await this.activityModel.find({ name: name, tags: tag }).populate({ path: 'category', match: { type: category } }).populate("comments").populate({ path: "advertiser_id", select: "name" });

        if (activities instanceof Error)
            throw new InternalServerError("Internal server error");

        if (activities == null)
            throw new NotFoundError("Activities not found");


        return new response(true, activities, "Fetched activities", 200);
    }

    public async getItinerariesService(name: string, category: string, tag: string) {
        const itineraries = await this.itineraryModel.find({ name: name, tags: tag }).populate({ path: 'category', match: { type: category } }).populate('timeline').populate('activities').populate({ path: "tour_guide_id", select: "name" });
        if (itineraries instanceof Error)
            throw new InternalServerError("Internal server error");

        if (itineraries == null)
            throw new NotFoundError("Itineraries not found");
        return new response(true, itineraries, "Fetched itineraries", 200);
    }

    public async getHistorical_locationsService(name: string, category: string, tag: string) {
        const historical_locations = await this.historical_locationsModel.find({ name: name, tags: tag }).populate({ path: 'category', match: { type: category } }).populate("comments").populate({ path: "governor_id", select: "name" });
        if (historical_locations instanceof Error)
            throw new InternalServerError("Internal server error");

        if (historical_locations == null)
            throw new NotFoundError("Historical locations not found");

        return new response(true, historical_locations, "Fetched historical locations", 200);
    }

    public async getUpcomingActivitiesService() {
        const today = new Date();
        const activities = await this.activityModel.find({ date_time: { $gte: today } }).populate('category').populate("comments").populate({ path: "advertiser_id", select: "name" });
        return new response(true, activities, "Fetched upcoming activities", 200);
    }

    public async getUpcomingItinerariesService() {
        const today = new Date();
        const itineraries = (await this.itineraryModel.find({ available_dates: { $gte: today } }).populate('category').populate('timeline').populate('activities').populate({ path: "tour_guide_id", select: "name" }));
        return new response(true, itineraries, "Fetched upcoming itineraries", 200);
    }

    public async getUpcomingHistorical_locationsService() {
        const today = new Date();
        const historical_locations = await this.historical_locationsModel.find({ date_time: { $gte: today } }).populate('category').populate("comments").populate({ path: "governor_id", select: "name" });
        return new response(true, historical_locations, "Fetched upcoming historical locations", 200);
    }


}
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import {
  ITouristCreateDTO,
  ITouristNewUserDTO,
  ITouristOutputDTO,
  ITouristUpdateDTO,
} from "@/interfaces/ITourist";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";

import Container, { Inject, Service } from "typedi";
import UserService from "./userService";
import bcrypt from "bcryptjs";

import { ObjectId } from "mongoose";
import { Types } from "mongoose";
import {
  IComment_Rating,
  IComment_RatingCreateDTOfortourGuide,
} from "@/interfaces/IComment_rating";

@Service()
export default class TouristService {
  constructor(
    @Inject("touristModel") private touristModel: Models.TouristModel,
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
    @Inject("historical_locationModel")
    private historical_locationsModel: Models.Historical_locationsModel,
    @Inject("activityModel") private activityModel: Models.ActivityModel,
    @Inject("comment_ratingModel")
    private comment_ratingModel: Models.Comment_ratingModel,
    @Inject("tour_guideModel") private tour_guideModel: Models.Tour_guideModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel
  ) {}

  public async getTouristService(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Tourist,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    if (user == null) throw new NotFoundError("User not found");

    const tourist = await this.touristModel.findOne({ user_id: user._id });
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (tourist == null) throw new NotFoundError("Tourist not found");

    const touristOutput: ITouristOutputDTO = {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      phone_number: user.phone_number,
      status: user.status,
      date_of_birth: tourist.date_of_birth, //May be changed
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
  }

  public async createTouristService(touristData: ITouristCreateDTO) {
    const IUserInputDTO = {
      email: touristData.email,
      name: touristData.name,
      username: touristData.username,
      password: touristData.password,
      role: UserRoles.Tourist,
      phone_number: touristData.phone_number,
    };
    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(IUserInputDTO);
    const newUser = new this.userModel(newUserResponse.data);
    // newUser.role = UserRoles.Tourist;
    await newUser.save();
    if (newUser instanceof Error)
      throw new InternalServerError("Internal server error");

    const newTouristData: ITouristNewUserDTO = {
      user_id: newUser._id as ObjectId,
      date_of_birth: touristData.date_of_birth,
      job: touristData.job,
      nation: touristData.nation,
    };
    const newTourist = new this.touristModel(newTouristData);
    await newTourist.save();
    if (newTourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (newTourist == null) throw new NotFoundError("Tourist not found");

    const touristOutput: ITouristOutputDTO = {
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      phone_number: newUser.phone_number,
      status: newUser.status,
      date_of_birth: newTourist.date_of_birth, //May be changed
      job: newTourist.job,
      nation: newTourist.nation,
      wallet: newTourist.wallet,
      loyality_points: newTourist.loyality_points,
      badge: newTourist.badge,
      addresses: newTourist.addresses,

      // cart: newTourist.cart,
      // wishlist: newTourist.wishlist,//out of current scope of sprint
    };
    return new response(true, touristOutput, "Tourist created", 201);
  }

  public async updateTouristService(
    searchEmail: string,
    touristUpdateData: ITouristUpdateDTO
  ) {
    // const phoneNumRegex =
    //   /^\+\d{1,3}[\s-]?(\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9})$/;
    // if (
    //   !touristUpdateData.phone_number ||
    //   !phoneNumRegex.test(touristUpdateData.phone_number)
    // )
    //   throw new BadRequestError("Invalid phone number");

    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (searchEmail || !emailRegex.test(searchEmail))
    //   throw new BadRequestError("Invalid inputted email");

    // if (
    //   !touristUpdateData.newEmail ||
    //   !emailRegex.test(touristUpdateData.newEmail)
    // )
    //   throw new BadRequestError("Invalid new email");
    let hashedPassword;
    if (touristUpdateData.password) {
      hashedPassword = await bcrypt.hash(touristUpdateData.password, 10); // Await bcrypt.hash here
    }
    const updatedUserData = {
      name: touristUpdateData.name,
      email: touristUpdateData.newEmail,
      password: hashedPassword,
      phone_number: touristUpdateData.phone_number,
    };
    const user = await this.userModel.findOneAndUpdate(
      { email: searchEmail, role: UserRoles.Tourist },
      updatedUserData,
      { new: true }
    );
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    if (user == null) throw new NotFoundError("User not found");

    const updatedTouristData = {
      job: touristUpdateData.job,
      nation: touristUpdateData.nation,
      addresses: touristUpdateData.addresses,
    };
    const tourist = await this.touristModel.findOneAndUpdate(
      { user_id: user._id },
      updatedTouristData,
      { new: true }
    );

    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (tourist == null) throw new NotFoundError("Tourist not found");

    const touristOutput: ITouristOutputDTO = {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      phone_number: user.phone_number,
      status: user.status,
      date_of_birth: tourist.date_of_birth, //May be changed
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
  }
  public async rateandcommentTour_guideService(
    id: string,
    data: IComment_RatingCreateDTOfortourGuide
  ) {
    const { tour_guide_email, comment, rating } = data;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid id");
    }
    if (!comment && !rating) {
      throw new BadRequestError(
        "Invalid input,please add either a comment or rating"
      );
    }

    if (rating && (rating < 0 || rating > 5)) {
      throw new BadRequestError("Invalid rating");
    }
    const user = await this.userModel.findOne({
      email: tour_guide_email,
      role: UserRoles.TourGuide,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");
    const tour_guide = await this.tour_guideModel.findOne({
      user_id: user._id,
    });
    // console.log(user._id);
    if (tour_guide instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tour_guide == null) throw new NotFoundError("Tour guide not found");

    // go I try to loop over the tour guide iternaries and check if the tourist has visited the location by booking_id
    let ticket;
    for (let i = 0; i < tour_guide.itineraries.length; i++) {
      // console.log(tour_guide.itineraries[i]);
      ticket = await this.ticketModel.findOne({
        type: "ITINERARY",
        booking_id: tour_guide.itineraries[i],
        tourist_id: new Types.ObjectId(id),
      });
    }
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error");
    if (ticket == null)
      throw new NotFoundError(
        "Tourist has not visited the location or meet the tour guide"
      );

    //create a new comment_rating
    const comment_rating = new this.comment_ratingModel({
      tourist_id: new Types.ObjectId(id),
      comment: comment,
      rating: rating,
    });
    if (comment_rating instanceof Error)
      throw new InternalServerError("Internal server error");
    await comment_rating.save();
    if (comment_rating instanceof Error)
      throw new InternalServerError("Internal server error");

    //update the tour guide comment_rating array
    if (!tour_guide.comments) {
      tour_guide.comments = [];
    }
    tour_guide.comments.push(comment_rating._id);
    await tour_guide.save();
    if (tour_guide instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, comment_rating, "Tour guide rated", 201);
  }
}

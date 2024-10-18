import { BadRequestError, InternalServerError, NotFoundError } from "@/types/Errors";
import { ITouristCreateDTO, ITouristNewUserDTO, ITouristOutputDTO, ITouristUpdateDTO } from "@/interfaces/ITourist";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";

import Container, { Inject, Service } from "typedi";
import UserService from "./userService";
import bcrypt from "bcryptjs";

import {
  IComment_Rating,
  IComment_RatingCreateDTOforActivity,
  IComment_RatingCreateDTOforItinerary,
  IComment_RatingCreateDTOfortourGuide,
} from "@/interfaces/IComment_rating";
import Historical_locationService from "./Historical_locationService";
import TouristBadge from "@/types/enums/touristBadge";
import { ObjectId, Types } from "mongoose";
import { IComplaintCreateDTO } from "@/interfaces/IComplaint";

// comment and ratings
// complaint
// order
// ticket
@Service()
export default class TouristService {
  constructor(
    @Inject("touristModel") private touristModel: Models.TouristModel,
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("complaintModel") private complaintModel: Models.ComplaintModel,
    @Inject("orderModel") private orderModel: Models.OrderModel,
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
    @Inject("historical_locationModel")
    private historical_locationsModel: Models.Historical_locationsModel,
    @Inject("activityModel") private activityModel: Models.ActivityModel,
    @Inject("comment_ratingModel")
    private comment_ratingModel: Models.Comment_ratingModel,
    @Inject("tour_guideModel") private tour_guideModel: Models.Tour_guideModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel,
  ) {}

  public async getTouristService(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Tourist,
    });
    if (user instanceof Error) throw new InternalServerError("Internal server error");

    if (user == null) throw new NotFoundError("User not found");

    const tourist = await this.touristModel.findOne({ user_id: user._id });
    if (tourist instanceof Error) throw new InternalServerError("Internal server error");

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
    if (newUser instanceof Error) throw new InternalServerError("Internal server error");

    const newTouristData: ITouristNewUserDTO = {
      user_id: newUser._id as ObjectId,
      date_of_birth: touristData.date_of_birth,
      job: touristData.job,
      nation: touristData.nation,
    };
    const newTourist = new this.touristModel(newTouristData);
    await newTourist.save();
    if (newTourist instanceof Error) throw new InternalServerError("Internal server error");

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

  public async updateTouristService(searchEmail: string, touristUpdateData: ITouristUpdateDTO) {
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
    const user = await this.userModel.findOneAndUpdate({ email: searchEmail, role: UserRoles.Tourist }, updatedUserData, { new: true });
    if (user instanceof Error) throw new InternalServerError("Internal server error");

    if (user == null) throw new NotFoundError("User not found");

    const updatedTouristData = {
      job: touristUpdateData.job,
      nation: touristUpdateData.nation,
      addresses: touristUpdateData.addresses,
    };
    const tourist = await this.touristModel.findOneAndUpdate({ user_id: user._id }, updatedTouristData, { new: true });

    if (tourist instanceof Error) throw new InternalServerError("Internal server error");

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
      logo: tourist.logo,

      // cart: tourist.cart,
      // wishlist: tourist.wishlist,//out of current scope of sprint
    };

    return new response(true, touristOutput, "Tourist updated", 200);
  }

  public async requestTouristAccountDeletionService(email: string) {
    const touristUserData = await this.userModel.findOne({ email });
    if (!touristUserData || touristUserData.role !== UserRoles.Tourist) throw new NotFoundError("No tourist exists with that email");
    const touristData = await this.touristModel.findOne({ user_id: touristUserData._id });
    if (!touristData) throw new NotFoundError("No tourist exists with that email");

    // the reason we delete ANYTHING that has this tourist's id, even when it doesn't make sense
    // (such as comments left on an activity), is because they would reference an id that does not exist
    // another solution (instead of outright deleting the tourist) is to edit the tourist's data such that
    // their information is deleted, but the id is maintained for other components to use
    // up to discussion really
    const deletedTouristUser = await this.userModel.findByIdAndDelete(touristUserData._id);
    const deletedTouristData = await this.touristModel.findOneAndDelete({ user_id: touristUserData._id });

    await this.comment_ratingModel.deleteMany({ tourist_id: touristData._id });
    await this.complaintModel.deleteMany({ tourist_id: touristData._id });
    await this.orderModel.deleteMany({ tourist_id: touristData._id });
    await this.ticketModel.deleteMany({ tourist_id: touristData._id });
    return new response(true, { deletedUserID: touristUserData._id, deletedTouristID: touristData._id }, "Request accepted, deleted tourist", 200);
  }
  public async rateandcommentTour_guideService(id: string, data: IComment_RatingCreateDTOfortourGuide) {
    const { tour_guide_email, comment, rating } = data;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid id");
    }
    if (!comment && !rating) {
      throw new BadRequestError("Invalid input,please add either a comment or rating");
    }

    if (rating && (rating < 0 || rating > 5)) {
      throw new BadRequestError("Invalid rating");
    }
    const user = await this.userModel.findOne({
      email: tour_guide_email,
      role: UserRoles.TourGuide,
    });
    if (user instanceof Error) throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");
    const tour_guide = await this.tour_guideModel.findOne({
      user_id: user._id,
    });
    if (tour_guide instanceof Error) throw new InternalServerError("Internal server error");
    if (tour_guide == null) throw new NotFoundError("Tour guide not found");

    // go I try to loop over the tour guide iternaries and check if the tourist has visited the location by booking_id
    let ticket;
    for (let i = 0; i < tour_guide.itineraries.length; i++) {
      ticket = await this.ticketModel.findOne({
        type: "ITINERARY",
        booking_id: tour_guide.itineraries[i],
        tourist_id: new Types.ObjectId(id),
      });
    }
    if (ticket instanceof Error) throw new InternalServerError("Internal server error");
    if (ticket == null) throw new NotFoundError("Tourist has not visited the location or meet the tour guide");

    //create a new comment_rating
    const comment_rating = new this.comment_ratingModel({
      tourist_id: new Types.ObjectId(id),
      comment: comment,
      rating: rating,
    });
    if (comment_rating instanceof Error) throw new InternalServerError("Internal server error");
    await comment_rating.save();
    if (comment_rating instanceof Error) throw new InternalServerError("Internal server error");

    //update the tour guide comment_rating array
    if (!tour_guide.comments) {
      tour_guide.comments = [];
    }
    tour_guide.comments.push(comment_rating._id);
    await tour_guide.save();
    if (tour_guide instanceof Error) throw new InternalServerError("Internal server error");

    return new response(true, comment_rating, "Tour guide rated", 201);
  }

  public async rateandcommentItineraryService(
    id: string,
    data: IComment_RatingCreateDTOforItinerary
  ) {
    const { comment, rating, itinerary_id } = data;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid id");
    }
    if (!comment && !rating) {
      throw new BadRequestError("Invalid input,please add either a comment or rating");
    }
    if (rating && (rating < 0 || rating > 5)) {
      throw new BadRequestError("Invalid rating");
    }

    const itinerary = await this.itineraryModel.findOne({
      _id: new Types.ObjectId(itinerary_id),
    });
    if (itinerary instanceof Error) throw new InternalServerError("Internal server error");
    if (itinerary == null) throw new NotFoundError("Itinerary not found");
    //go to tickets and check if the tourist has visited the location
    const ticket = await this.ticketModel.findOne({
      type: "ITINERARY",
      booking_id: itinerary._id,
      tourist_id: new Types.ObjectId(id),
    });
    if (ticket instanceof Error) throw new InternalServerError("Internal server error");
    if (ticket == null) throw new NotFoundError("Tourist has not visited the location or meet the tour guide");
    //create a new comment_rating
    const comment_rating = new this.comment_ratingModel({
      tourist_id: new Types.ObjectId(id),
      comment: comment,
      rating: rating,
    });
    if (comment_rating instanceof Error) throw new InternalServerError("Internal server error");
    await comment_rating.save();
    if (comment_rating instanceof Error) throw new InternalServerError("Internal server error");
    //update the itinerary comment_rating array
    if (!itinerary.comments) {
      itinerary.comments = [];
    }
    itinerary.comments.push(comment_rating._id);
    await itinerary.save();
    if (itinerary instanceof Error) throw new InternalServerError("Internal server error");
    //update the average rating of the itinerary
    if (!itinerary.average_rating) {
      itinerary.average_rating = 0;
    }
    if (rating) {
      let count = itinerary.comments.length - 1;
      let sum = count * itinerary.average_rating;
      sum += rating;
      count++;
      itinerary.average_rating = sum / count;
      await itinerary.save();
      if (itinerary instanceof Error) throw new InternalServerError("Internal server error");
    }
    return new response(true, comment_rating, "Itinerary rated", 201);
  }

  public async rateandcommentActivityService(
    id: string,
    data: IComment_RatingCreateDTOforActivity
  ) {
    const { activity_id, comment, rating } = data;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid id");
    }
    if (!comment && !rating) {
      throw new BadRequestError("Invalid input,please add either a comment or rating");
    }
    if (rating && (rating < 0 || rating > 5)) {
      throw new BadRequestError("Invalid rating");
    }
    //find the activity ID
    const activity = await this.activityModel.findOne({
      _id: new Types.ObjectId(activity_id),
    });
    if (activity instanceof Error) throw new InternalServerError("Internal server error");
    if (activity == null) throw new NotFoundError("Activity not found");
    //go to tickets and check if the tourist has visited the location
    const ticket = await this.ticketModel.findOne({
      type: "ACTIVITY",
      booking_id: activity._id,
      tourist_id: new Types.ObjectId(id),
    });
    if (ticket instanceof Error) throw new InternalServerError("Internal server error");
    if (ticket == null) throw new NotFoundError("Tourist has not visited the location or done this Activity");
    //create a new comment_rating
    const comment_rating = new this.comment_ratingModel({
      tourist_id: new Types.ObjectId(id),
      comment: comment,
      rating: rating,
    });
    if (comment_rating instanceof Error) throw new InternalServerError("Internal server error");
    await comment_rating.save();
    if (comment_rating instanceof Error) throw new InternalServerError("Internal server error");
    //update the activity comment_rating array
    if (!activity.comments) {
      activity.comments = [];
    }
    activity.comments.push(comment_rating._id);
    await activity.save();
    if (activity instanceof Error) throw new InternalServerError("Internal server error");
    //update the average rating of the activity
    if (!activity.average_rating && rating) {
      activity.average_rating = 0;
    }
    if (rating) {
      let count = activity.comments.length - 1;
      let sum = count * activity.average_rating;
      sum += rating;
      count++;
      activity.average_rating = sum / count;
      await activity.save();
      if (activity instanceof Error) throw new InternalServerError("Internal server error");
    }
    return new response(true, comment_rating, "Activity rated", 201);
  }

  public async bookActivityService(email: string, activity_id: string) {
    if (!Types.ObjectId.isValid(activity_id)) {
      throw new BadRequestError("Invalid id");
    }
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

    const tourist_id = tourist._id;

    const activity = await this.activityModel.findById({ _id: activity_id });

    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");

    if (activity == null) throw new NotFoundError("Activity not found");

    if (activity.booking_flag == false)
      throw new BadRequestError("Activity is not available for booking");

    if (activity.inappropriate_flag == true)
      throw new BadRequestError("Activity is inappropriate");

    if (activity.active_flag == false)
      throw new BadRequestError("Activity is not active");

    if (activity.special_discount) {
      if (activity.price !== undefined) {
        activity.price =
          activity.price - activity.price * (activity.special_discount / 100);
      }
    }
    let points_received;
    if (activity.price !== undefined) {
      points_received = await this.recievePointsService(
        tourist_id as Types.ObjectId,
        activity.price
      );
    } else {
      throw new BadRequestError("Activity price is undefined");
    }
    this.recieveBadgeService(
      tourist_id as Types.ObjectId,
      tourist.loyality_points
    );
    const ticket = new this.ticketModel({
      tourist_id: tourist_id,
      type: "ACTIVITY",
      price: activity.price,
      booking_id: activity_id,
      cancelled: false,
      points_received: points_received,
    });

    await ticket.save();

    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error in saving ticket");
    return new response(true, ticket, "Activity booked", 201);
  }

  public async bookItineraryService(email: string, itinerary_id: string) {
    if (!Types.ObjectId.isValid(itinerary_id)) {
      throw new BadRequestError("Invalid id");
    }
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

    const tourist_id = tourist._id;

    const itinerary = await this.itineraryModel.findById({ _id: itinerary_id });

    if (itinerary instanceof Error)
      throw new InternalServerError("Internal server error");

    if (itinerary == null) throw new NotFoundError("Itinerary not found");

    if (itinerary.active_flag == false)
      throw new BadRequestError("Itinerary is not active for booking");

    if (itinerary.inappropriate_flag == true)
      throw new BadRequestError("Itinerary is inappropriate");

    let points_received = await this.recievePointsService(
      tourist_id as Types.ObjectId,
      itinerary.price
    );

    this.recieveBadgeService(
      tourist_id as Types.ObjectId,
      tourist.loyality_points
    );
    const ticket = new this.ticketModel({
      tourist_id: tourist_id,
      type: "ITINERARY",
      price: itinerary.price,
      booking_id: itinerary_id,
      cancelled: false,
      points_received: points_received,
    });
    ticket.save();
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error in saving ticket");

    return new response(true, ticket, "Itinerary booked", 201);
  }

  public async bookHistoricalLocationService(
    email: string,
    historical_location_id: string
  ) {
    const historicalLocationService = Container.get(Historical_locationService);

    if (!Types.ObjectId.isValid(historical_location_id)) {
      throw new BadRequestError("Invalid id");
    }
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

    const tourist_id = tourist._id;

    const historical_location = await this.historical_locationsModel.findById(
      historical_location_id
    );

    if (historical_location instanceof Error)
      throw new InternalServerError("Internal server error");

    if (historical_location == null)
      throw new NotFoundError("Historical location not found");

    if (historical_location.active_flag == false)
      throw new BadRequestError(
        "Historical location is not active for booking"
      );
    //check right price for tourist

    const price = await historicalLocationService.choosePrice(
      historical_location,
      tourist
    );

    let points_received = await this.recievePointsService(
      tourist_id as Types.ObjectId,
      price
    );

    this.recieveBadgeService(
      tourist_id as Types.ObjectId,
      tourist.loyality_points
    );
    const ticket = new this.ticketModel({
      tourist_id: tourist_id,
      type: "HISTORICAL_LOCATION",
      price: price,
      booking_id: historical_location_id,
      cancelled: false,
      points_received: points_received,
    });
    ticket.save();

    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error in saving ticket");
    return new response(true, ticket, "Historical location booked", 201);
  }

  public async recievePointsService(
    tourist_id: Types.ObjectId,
    amount: number
  ) {
    const tourist = await this.touristModel.findById(tourist_id);

    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (tourist == null) throw new NotFoundError("Tourist not found");

    let points = tourist.loyality_points;
    const badge = tourist.badge;

    switch (badge) {
      case TouristBadge.LEVEL1:
        points += amount * 0.5;
        break;
      case TouristBadge.LEVEL2:
        points += amount * 1;
        break;
      case TouristBadge.LEVEL3:
        points += amount * 1.5;
        break;
      default:
        throw new BadRequestError("Invalid badge");
    }
    const points_received = points - tourist.loyality_points;

    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      tourist_id,
      { loyality_points: points },
      { new: true }
    );

    if (updatedTourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (updatedTourist == null) throw new NotFoundError("Tourist not found");

    return points_received;
  }

  public async recieveBadgeService(tourist_id: Types.ObjectId, points: number) {
    const tourist = await this.touristModel.findById(tourist_id);

    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (tourist == null) throw new NotFoundError("Tourist not found");

    let badge = tourist.badge;

    if (points <= 100000) {
      badge = TouristBadge.LEVEL1;
    } else if (points <= 500000) {
      badge = TouristBadge.LEVEL2;
    } else {
      badge = TouristBadge.LEVEL3;
    }
    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      tourist_id,
      { badge: badge },
      { new: true }
    );

    if (updatedTourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (updatedTourist == null) throw new NotFoundError("Tourist not found");

    return new response(true, updatedTourist, "Badge recieved", 200);
  }

  public async redeemPointsService(email: string, points: number) {
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

    if (points < 10000) {
      throw new BadRequestError(
        "Insufficient points must have atleast 10000 for 100EGP"
      );
    }
    if (points < tourist.loyality_points) {
      throw new BadRequestError(
        "Sorry you do not have enough points to redeem"
      );
    }

    let i = Math.floor(points / 10000);

    for (let j = 0; j < i; j++) {
      tourist.wallet + 100;
      tourist.loyality_points - 10000;
    }

    return new response(true, tourist, "Points redeemed", 200);
  }
  //flag to check if the tourist went with this tour guide
  public async checkTourGuideService(
    tourist_id: string,
    tour_guide_email: string
  ) {
    if (!Types.ObjectId.isValid(tourist_id) || !tour_guide_email) {
      throw new BadRequestError("Invalid id or email");
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
    if (tour_guide instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tour_guide == null) throw new NotFoundError("Tour guide not found");

    // go I try to loop over the tour guide iternaries and check if the tourist has visited the location by booking_id
    let ticket;
    for (let i = 0; i < tour_guide.itineraries.length; i++) {
      ticket = await this.ticketModel.findOne({
        type: "ITINERARY",
        booking_id: tour_guide.itineraries[i],
        tourist_id: new Types.ObjectId(tourist_id),
      });
    }
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error");
    if (ticket == null) {
      //return false if the tourist has not visited the location
      return new response(false, ticket, "Tour guide not found", 201);
    }
    //return true if the tourist has visited the location
    return new response(true, null, "Tour guide found", 201);
  }
  //flag to check if the tourist went with this itinerary
  public async checkItineraryService(tourist_id: string, itinerary_id: string) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    if (!Types.ObjectId.isValid(itinerary_id)) {
      throw new BadRequestError("Invalid itinerary id");
    }
    const itinerary = await this.itineraryModel.findById(
      new Types.ObjectId(itinerary_id)
    );
    if (itinerary instanceof Error)
      throw new InternalServerError("Internal server error");
    if (itinerary == null) throw new NotFoundError("Itinerary not found");
    const ticket = await this.ticketModel.findOne({
      type: "ITINERARY",
      booking_id: itinerary._id,
      tourist_id: new Types.ObjectId(tourist_id),
    });
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error");
    if (ticket == null) {
      //return false if the tourist has not visited the location
      return new response(false, null, "Itinerary not found", 201);
    }
    //return true if the tourist has visited the location
    return new response(true, null, "Itinerary found", 201);
  }
  //flag for activity
  public async checkActivityService(tourist_id: string, activity_id: string) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    if (!Types.ObjectId.isValid(activity_id)) {
      throw new BadRequestError("Invalid activity id");
    }
    const activity = await this.activityModel.findById(
      new Types.ObjectId(activity_id)
    );
    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
    if (activity == null) throw new NotFoundError("Activity not found");
    const ticket = await this.ticketModel.findOne({
      type: "ACTIVITY",
      booking_id: activity._id,
      tourist_id: new Types.ObjectId(tourist_id),
    });
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error");
    if (ticket == null) {
      //return false if the tourist has not visited the location
      return new response(false, null, "Activity not found", 201);
    }
    //return true if the tourist has visited the location
    return new response(true, null, "Activity found", 201);
  }
  public async fileComplaintService(
    tourist_id: string,
    data: IComplaintCreateDTO
  ) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    const tourist = await this.touristModel.findById(tourist_id);
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist == null) throw new NotFoundError("Tourist not found");
    const complaint = new this.complaintModel({
      tourist_id: new Types.ObjectId(tourist_id),
      title: data.title,
      date: data.date === undefined ? new Date() : data.date,
      body: data.body,
    });
    if (complaint instanceof Error)
      throw new InternalServerError("Internal server error");
    await complaint.save();

    return new response(true, complaint, "Complaint filed", 201);
  }
}

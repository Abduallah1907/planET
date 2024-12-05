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

import {
  IComment_Rating,
  IComment_RatingCreateDTOforActivity,
  IComment_RatingCreateDTOforItinerary,
  IComment_RatingCreateDTOforProduct,
  IComment_RatingCreateDTOfortourGuide,
} from "@/interfaces/IComment_rating";
import Historical_locationService from "./Historical_locationService";
import TouristBadge from "@/types/enums/touristBadge";
import { ObjectId, Document, Schema, Types } from "mongoose";
import { IComplaintCreateDTO } from "@/interfaces/IComplaint";
import { ITicketBooking } from "@/interfaces/ITicket";
import TicketType from "@/types/enums/ticketType";
import { time } from "console";
import { ITourGuideInfoOutputDTO } from "@/interfaces/ITour_guide";
import { IUser } from "@/interfaces/IUser";
import itinerary from "@/api/routes/itinerary";
import { IOrderCartDTO } from "@/interfaces/IOrder";
import PaymentType from "@/types/enums/paymentType";
import OrderStatus from "@/types/enums/orderStatus";
import UserStatus from "@/types/enums/userStatus";
import Ticket from "@/models/Ticket";
import { IBookmarkActivity } from "@/interfaces/IBookmark_notify";
import category from "@/api/routes/category";
import advertiser from "@/api/routes/advertiser";
import NotificationService from "./notificationService";
import { IAddress } from "@/interfaces/IAddress";

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
    @Inject("productModel") private productModel: Models.ProductModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel,
    @Inject("cartModel") private cartModel: Models.CartModel,
    @Inject("promo_codeModel") private promoCodeModel: Models.Promo_codeModel,
    @Inject("bookmark_notifyModel")
    private bookmark_notifyModel: Models.Bookmark_notifyModel,
    @Inject("notificationModel")
    private notificationModel: Models.NotificationModel,
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("addressModel") private addressModel: Models.AddressModel
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
      logo: tourist.logo,

      // cart: tourist.cart,
      // wishlist: tourist.wishlist,//out of current scope of sprint
    };

    return new response(true, touristOutput, "Tourist updated", 200);
  }

  public async requestTouristAccountDeletionService(email: string) {
    const touristUserData = await this.userModel.findOne({ email });
    if (!touristUserData || touristUserData.role !== UserRoles.Tourist)
      throw new NotFoundError("No tourist exists with that email");
    const touristData = await this.touristModel.findOne({
      user_id: touristUserData._id,
    });
    if (!touristData)
      throw new NotFoundError("No tourist exists with that email");

    // the reason we delete ANYTHING that has this tourist's id, even when it doesn't make sense
    // (such as comments left on an activity), is because they would reference an id that does not exist
    // another solution (instead of outright deleting the tourist) is to edit the tourist's data such that
    // their information is deleted, but the id is maintained for other components to use
    // up to discussion really
    const deletedTouristUser = await this.userModel.findByIdAndDelete(
      touristUserData._id
    );
    const deletedTouristData = await this.touristModel.findOneAndDelete({
      user_id: touristUserData._id,
    });

    await this.comment_ratingModel.deleteMany({ tourist_id: touristData._id });
    await this.complaintModel.deleteMany({ tourist_id: touristData._id });
    await this.orderModel.deleteMany({ tourist_id: touristData._id });
    await this.ticketModel.deleteMany({ tourist_id: touristData._id });
    return new response(
      true,
      { deletedUserID: touristUserData._id, deletedTouristID: touristData._id },
      "Request accepted, deleted tourist",
      200
    );
  }
  public async rateAndCommentTour_guideService(
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
    if (tour_guide instanceof Error)
      throw new InternalServerError("Internal server error");
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

  public async rateAndCommentItineraryService(
    id: string,
    data: IComment_RatingCreateDTOforItinerary
  ) {
    const { comment, rating, itinerary_id } = data;
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

    const itinerary = await this.itineraryModel.findOne({
      _id: new Types.ObjectId(itinerary_id),
    });
    if (itinerary instanceof Error)
      throw new InternalServerError("Internal server error");
    if (itinerary == null) throw new NotFoundError("Itinerary not found");
    //go to tickets and check if the tourist has visited the location
    const ticket = await this.ticketModel.findOne({
      type: "ITINERARY",
      booking_id: itinerary._id,
      tourist_id: new Types.ObjectId(id),
    });
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
    //update the itinerary comment_rating array
    if (!itinerary.comments) {
      itinerary.comments = [];
    }
    itinerary.comments.push(comment_rating._id);
    await itinerary.save();
    if (itinerary instanceof Error)
      throw new InternalServerError("Internal server error");
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
      if (itinerary instanceof Error)
        throw new InternalServerError("Internal server error");
    }
    return new response(true, comment_rating, "Itinerary rated", 201);
  }

  public async rateAndCommentActivityService(
    id: string,
    data: IComment_RatingCreateDTOforActivity
  ) {
    const { activity_id, comment, rating } = data;
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
    //find the activity ID
    const activity = await this.activityModel.findOne({
      _id: new Types.ObjectId(activity_id),
    });
    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
    if (activity == null) throw new NotFoundError("Activity not found");
    //go to tickets and check if the tourist has visited the location
    const ticket = await this.ticketModel.findOne({
      type: "ACTIVITY",
      booking_id: activity._id,
      tourist_id: new Types.ObjectId(id),
    });
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error");
    if (ticket == null)
      throw new NotFoundError(
        "Tourist has not visited the location or done this Activity"
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
    //update the activity comment_rating array
    if (!activity.comments) {
      activity.comments = [];
    }
    activity.comments.push(comment_rating._id);
    await activity.save();
    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
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
      if (activity instanceof Error)
        throw new InternalServerError("Internal server error");
    }
    return new response(true, comment_rating, "Activity rated", 201);
  }

  public async bookActivityService(
    email: string,
    activity_id: string,
    payment_type: PaymentType,
    promoCode: string
  ) {
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
    if (activity === null) throw new NotFoundError("Activity not found");
    if (activity.booking_flag === false)
      throw new BadRequestError("Activity is not available for booking");
    if (activity.inappropriate_flag === true)
      throw new BadRequestError("Activity is inappropriate");
    if (activity.active_flag === false)
      throw new BadRequestError("Activity is not active");
    if (activity.date < new Date()) {
      throw new BadRequestError("Activity date has passed cannot book");
    }
    if (activity.price !== undefined) {
      if (activity.special_discount) {
        activity.price =
          activity.price - activity.price * (activity.special_discount / 100);
      }
      if (promoCode) {
        const validPromo = await this.isValidCodeService(promoCode);
        if (!validPromo)
          throw new BadRequestError(
            "There was an issue when tyring to check the promo code"
          );
        activity.price =
          activity.price -
          activity.price * (validPromo.data.discount_percent / 100);
      }
    }

    const findPreviousTicket = await this.ticketModel.findOne({
      tourist_id: tourist_id,
      booking_id: activity_id,
      type: TicketType.Activity,
      cancelled: false,
    });
    if (findPreviousTicket) {
      throw new BadRequestError("Already booked this activity");
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
      tourist.total_loyality_points
    );
    if (tourist.wallet < activity.price) {
      throw new BadRequestError("Insufficient balance");
    }

    const ticket = new this.ticketModel({
      tourist_id: tourist_id as ObjectId,
      type: TicketType.Activity,
      price: activity.price,
      booking_id: activity_id,
      cancelled: false,
      points_received: points_received,
      payment_type: payment_type,
      time_to_attend: new Date(
        `${activity.date.toISOString().split("T")[0]}T${activity.time}`
      ), // Combine date and time
    });

    await ticket.save();
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error in saving ticket");

    const newWallet = tourist.wallet - activity.price;
    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      tourist_id,
      { wallet: newWallet, $push: { tickets: ticket._id } },
      { new: true }
    );
    if (updatedTourist instanceof Error)
      throw new InternalServerError(
        "Internal server error in updating tourist"
      );

    if (updatedTourist == null) throw new NotFoundError("Tourist not found");
    //Send the receipt to the tourist email
    const notificationService = Container.get(NotificationService);
    const receiptMessage = `Dear ${user.name},\n\nYour Activity booking for ${
      activity.name
    } has been confirmed. Here are the details:\n\nActivity: ${
      activity.name
    }\nDate: ${activity.date.toDateString()}\n${
      activity.price != undefined
        ? `Price: ${activity.price}`
        : `Price Range: ${activity.price_range?.min} - ${activity.price_range?.max}`
    }\nID: ${activity._id}
        \n\nThank you for booking with us!\n\nBest regards,\nYour Favourite Travel Team`;

    const emailSent = await notificationService.sendEmailNotificationService(
      "Itinerary Booking Confirmation",
      user.email,
      receiptMessage
    );

    if (emailSent instanceof Error) {
      throw new InternalServerError(
        "Failed to send booking confirmation email"
      );
    }
    if (emailSent == null) {
      throw new InternalServerError(
        "Failed to send booking confirmation email"
      );
    }

    return new response(true, ticket, "Activity booked", 201);
  }

  public async bookItineraryService(
    email: string,
    itinerary_id: string,
    time_to_attend: Date,
    payment_type: PaymentType,
    promoCode: string
  ) {
    if (!Types.ObjectId.isValid(itinerary_id)) {
      throw new BadRequestError("Invalid id");
    }
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Tourist,
    });

    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user === null) throw new NotFoundError("User not found");
    const tourist = await this.touristModel.findOne({ user_id: user._id });
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist === null) throw new NotFoundError("Tourist not found");
    const tourist_id = tourist._id;

    const itinerary = await this.itineraryModel.findById({ _id: itinerary_id });
    if (itinerary instanceof Error)
      throw new InternalServerError("Internal server error");
    if (itinerary === null) throw new NotFoundError("Itinerary not found");
    if (itinerary.active_flag === false)
      throw new BadRequestError("Itinerary is not active for booking");
    if (itinerary.inappropriate_flag === true)
      throw new BadRequestError("Itinerary is inappropriate");
    const timeToAttendDate = new Date(time_to_attend);
    if (timeToAttendDate < new Date()) {
      throw new BadRequestError(
        "Itinerary date you choose has passed, cannot book"
      );
    }

    const findPreviousTicket = await this.ticketModel.findOne({
      tourist_id: tourist_id,
      booking_id: itinerary_id,
      type: TicketType.Itinerary,
      time_to_attend: time_to_attend,
      cancelled: false,
    });
    if (findPreviousTicket) {
      throw new BadRequestError("Already booked this itinerary");
    }
    if (promoCode) {
      const validPromo = await this.isValidCodeService(promoCode);
      if (!validPromo)
        throw new BadRequestError(
          "There was an issue when tyring to check the promo code"
        );
      itinerary.price =
        itinerary.price -
        itinerary.price * (validPromo.data.discount_percent / 100);
    }

    let points_received = await this.recievePointsService(
      tourist_id as Types.ObjectId,
      itinerary.price
    );

    this.recieveBadgeService(
      tourist_id as Types.ObjectId,
      tourist.total_loyality_points
    );
    if (tourist.wallet < itinerary.price) {
      throw new BadRequestError("Insufficient balance");
    }
    const ticket = new this.ticketModel({
      tourist_id: tourist_id,
      type: "ITINERARY",
      price: itinerary.price,
      booking_id: itinerary_id,
      cancelled: false,
      points_received: points_received,
      payment_type: payment_type,
      time_to_attend: time_to_attend,
    });
    ticket.save();
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error in saving ticket");

    const newWallet = tourist.wallet - itinerary.price;
    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      tourist_id,
      { wallet: newWallet, $push: { tickets: ticket._id } },
      { new: true }
    );

    if (updatedTourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (updatedTourist == null) throw new NotFoundError("Tourist not found");
    //Send the receipt to the tourist email
    const notificationService = Container.get(NotificationService);
    const receiptMessage = `Dear ${user.name},\n\nYour itinerary booking for ${itinerary.name} has been confirmed. Here are the details:\n\nItinerary: ${itinerary.name}\nDate: ${time_to_attend}\nPrice: ${itinerary.price}\nID: ${itinerary._id}
    \n\nThank you for booking with us!\n\nBest regards,\nYour Favourite Travel Team`;

    const emailSent = await notificationService.sendEmailNotificationService(
      "Itinerary Booking Confirmation",
      user.email,
      receiptMessage
    );

    if (emailSent instanceof Error) {
      throw new InternalServerError(
        "Failed to send booking confirmation email"
      );
    }
    if (emailSent == null) {
      throw new InternalServerError(
        "Failed to send booking confirmation email"
      );
    }
    return new response(true, ticket, "Itinerary booked", 201);
  }

  public async bookHistoricalLocationService(
    email: string,
    historical_location_id: string,
    payment_type: PaymentType
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
      tourist.total_loyality_points
    );
    if (tourist.wallet < price) {
      throw new BadRequestError("Insufficient balance");
    }

    const ticket = new this.ticketModel({
      tourist_id: tourist_id,
      type: "HISTORICAL_LOCATION",
      price: price,
      booking_id: historical_location_id,
      cancelled: false,
      points_received: points_received,
      payment_type: payment_type,
      time_to_attend: new Date(
        `${historical_location.date.toISOString().split("T")[0]}T${
          historical_location.time
        }`
      ), // Combine date and time
    });
    ticket.save();

    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error in saving ticket");

    const newWallet = tourist.wallet - price;
    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      tourist_id,
      { wallet: newWallet, $push: { tickets: ticket._id } },
      { new: true }
    );
    //Send the receipt to the tourist email
    //Send the receipt to the tourist email
    // const notificationService = Container.get(NotificationService);
    // const receiptMessage = `Dear ${user.name},\n\n
    // Your historical location booking for
    // ${historical_location.name} has been confirmed.
    //  Here are the details:\n\n
    //  Historical Location: ${historical_location.name}
    //  \nDate: ${historical_location.date_time}\n
    //  Price: ${historical_location.price}\nID: ${historical_location._id}
    // \n\nThank you for booking with us!\n\nBest regards,\nYour Favourite Travel Team`;

    // const emailSent = await notificationService.sendEmailNotificationService(
    //   "Itinerary Booking Confirmation",
    //   user.email,
    //   receiptMessage
    // );

    // if (emailSent instanceof Error) {
    //   throw new InternalServerError(
    //     "Failed to send booking confirmation email"
    //   );
    // }
    // if (emailSent == null) {
    //   throw new InternalServerError(
    //     "Failed to send booking confirmation email"
    //   );
    // }

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

    const totalPointsUpdated = tourist.total_loyality_points + points_received;

    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      tourist_id,
      { loyality_points: points, total_loyality_points: totalPointsUpdated },
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
    if (points < 10000) {
      throw new BadRequestError(
        "Insufficient points must have atleast 10000 for 100EGP"
      );
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

    if (points > tourist.loyality_points) {
      throw new BadRequestError(
        `Sorry you do not have enough points to redeem. You currently have ${tourist.loyality_points} points.`
      );
    }

    let i = Math.floor(points / 10000);

    for (let j = 0; j < i; j++) {
      tourist.wallet += 100;
      tourist.loyality_points -= 10000;
    }
    tourist.save();
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
      date: data.date === undefined ? Date.now() : data.date,
      body: data.body,
    });
    if (complaint instanceof Error)
      throw new InternalServerError("Internal server error");
    await complaint.save();

    return new response(true, complaint, "Complaint filed successfully", 201);
  }
  //View My list of complaints
  public async viewMyComplaintsService(tourist_id: string) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    const tourist = await this.touristModel.findById(tourist_id);
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist == null) throw new NotFoundError("Tourist not found");
    const complaints = await this.complaintModel.find({
      tourist_id: new Types.ObjectId(tourist_id),
    });
    if (complaints instanceof Error)
      throw new InternalServerError("Internal server error");
    if (complaints == null) throw new NotFoundError("Complaint not found");
    return new response(true, complaints, "Complaints found", 200);
  }
  //Flag to rate and comment on a product
  public async flagToRateAndCommentProductService(
    tourist_id: string,
    product_id: string
  ) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    if (!Types.ObjectId.isValid(product_id)) {
      throw new BadRequestError("Invalid product id ");
    }
    const product = await this.productModel.findById(
      new Types.ObjectId(product_id)
    );
    if (product instanceof Error)
      throw new InternalServerError("Internal server error");
    if (product == null) throw new NotFoundError("Product not found");
    //go to order and check if the tourist has ordered the product
    const order = await this.orderModel.findOne({
      tourist_id: new Types.ObjectId(tourist_id),
      products: { $elemMatch: { $eq: new Types.ObjectId(product_id) } },
      status: "Delivered",
    });
    if (order instanceof Error)
      throw new InternalServerError("Internal server error");
    if (order == null) {
      //return false if the tourist has not visited the location
      return new response(false, null, "Product not found", 201);
    }
    //return true if the tourist has visited the location
    return new response(true, null, "Product found", 201);
  }
  //Rate and comment on product
  public async rateAndCommentProductService(
    tourist_id: string,
    data: IComment_RatingCreateDTOforProduct
  ) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    const { product_id, comment, rating } = data;
    if (!comment && !rating) {
      throw new BadRequestError(
        "Invalid input,please add either a comment or rating"
      );
    }
    if (rating && (rating < 0 || rating > 5)) {
      throw new BadRequestError("Invalid rating");
    }
    if (!Types.ObjectId.isValid(product_id)) {
      throw new BadRequestError("Invalid product id ");
    }
    const product = await this.productModel.findById(
      new Types.ObjectId(product_id)
    );
    if (product instanceof Error)
      throw new InternalServerError("Internal server error");
    if (product == null) throw new NotFoundError("Product not found");
    //go to order and check if the tourist has ordered the product
    const order = await this.orderModel.findOne({
      tourist_id: new Types.ObjectId(tourist_id),
      "products.items": {
        $elemMatch: { product_id: new Types.ObjectId(product_id) },
      },
      status: "Delivered",
    });
    if (order instanceof Error)
      throw new InternalServerError("Internal server error");
    if (order == null) {
      throw new BadRequestError("Tourist has not ordered the product");
    }
    //create a new comment_rating
    const comment_rating = new this.comment_ratingModel({
      tourist_id: new Types.ObjectId(tourist_id),
      comment: comment,
      rating: rating,
    });
    if (comment_rating instanceof Error)
      throw new InternalServerError("Internal server error");
    await comment_rating.save();
    if (comment_rating instanceof Error)
      throw new InternalServerError("Internal server error");
    //update the product comment_rating array
    if (!product.comments) {
      product.comments = [];
    }
    product.comments.push(comment_rating._id);
    await product.save();
    if (product instanceof Error)
      throw new InternalServerError("Internal server error");
    //update the average rating of the product
    if (!product.average_rating) {
      product.average_rating = 0;
    }
    if (rating) {
      let count = product.comments.length - 1;
      let sum = count * product.average_rating;
      sum += rating;
      count++;
      product.average_rating = sum / count;
      await product.save();
      if (product instanceof Error)
        throw new InternalServerError("Internal server error");
    }
    return new response(true, comment_rating, "Product rated", 201);
  }
  //cancel a ticket
  public async cancelTicketService(tourist_id: string, ticket_id: string) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    if (!Types.ObjectId.isValid(ticket_id)) {
      throw new BadRequestError("Invalid ticket id ");
    }
    const ticket = await this.ticketModel.findById(ticket_id);
    if (ticket instanceof Error)
      throw new InternalServerError("Internal server error");
    if (ticket == null) throw new NotFoundError("Ticket not found");
    if (ticket.cancelled == true) {
      throw new BadRequestError("Ticket already cancelled");
    }
    switch (ticket.type) {
      case "ACTIVITY": {
        const activity = await this.activityModel.findById(ticket.booking_id);
        if (activity instanceof Error)
          throw new InternalServerError("Internal server error");
        if (activity == null) throw new NotFoundError("Activity not found");
        if (activity.active_flag == false)
          throw new BadRequestError("Activity is not active for booking");
        if (activity.inappropriate_flag == true)
          throw new BadRequestError("Activity is inappropriate");
        if (activity.booking_flag == false)
          throw new BadRequestError("Activity is not available for booking");
        //check if the activity have 48 left to start
        if (ticket.time_to_attend) {
          const diff = ticket.time_to_attend.getTime() - new Date().getTime();
          if (diff < 48 * 60 * 1000) {
            throw new BadRequestError(
              "Activity cannot be cancelled 48 hours before start"
            );
          }
        } else {
          throw new BadRequestError("Activity date is undefined");
        }
        ticket.cancelled = true;
        break;
      }
      case "ITINERARY": {
        const itinerary = await this.itineraryModel.findById(ticket.booking_id);
        if (itinerary instanceof Error)
          throw new InternalServerError("Internal server error");
        if (itinerary == null) throw new NotFoundError("Itinerary not found");
        if (itinerary.active_flag == false)
          throw new BadRequestError("Itinerary is not active for booking");
        if (itinerary.inappropriate_flag == true)
          throw new BadRequestError("Itinerary is inappropriate");
        //check if the itinerary have 48 left to start
        if (ticket.time_to_attend) {
          const diff = ticket.time_to_attend.getTime() - new Date().getTime();
          if (diff < 48 * 60 * 60 * 1000) {
            throw new BadRequestError(
              "Itinerary cannot be cancelled 48 hours before start"
            );
          }
        } else {
          throw new BadRequestError("Itinerary date is undefined");
        }
        ticket.cancelled = true;
        break;
      }
      default: {
        throw new BadRequestError("Invalid ticket type to be cancelled");
      }
    }
    //decrease the points of the tourist
    const tourist = await this.touristModel.findById(tourist_id);
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist == null) throw new NotFoundError("Tourist not found");
    let loyality_points = 0;
    switch (tourist.badge) {
      case TouristBadge.LEVEL1:
        loyality_points = Number(ticket.price) * 0.5;
        break;
      case TouristBadge.LEVEL2:
        loyality_points = Number(ticket.price) * 1;
        break;
      case TouristBadge.LEVEL3:
        loyality_points = Number(ticket.price) * 1.5;
        break;
      default:
        throw new BadRequestError("Invalid badge");
    }
    //check if the tourist have enough points to cancel the ticket,if not remove the equivalent from the wallet
    //also refund the tourist
    if (tourist.loyality_points < loyality_points) {
      loyality_points -= tourist.loyality_points;
      const removefromwallet = loyality_points / 100;
      const updatedTourist = await this.touristModel.findByIdAndUpdate(
        tourist_id,
        {
          wallet: tourist.wallet + Number(ticket.price) - removefromwallet,
          loyality_points: 0,
        },
        { new: true }
      );
      if (updatedTourist instanceof Error)
        throw new InternalServerError("Internal server error");
      if (updatedTourist == null) throw new NotFoundError("Tourist not found");
    } else {
      const updatedTourist = await this.touristModel.findByIdAndUpdate(
        tourist_id,
        {
          wallet: tourist.wallet + Number(ticket.price),
          loyality_points: tourist.loyality_points - loyality_points,
        },
        { new: true }
      );
      if (updatedTourist instanceof Error)
        throw new InternalServerError("Internal server error");
      if (updatedTourist == null) throw new NotFoundError("Tourist not found");
    }
    await ticket.save();
    return new response(true, ticket, "Ticket cancelled", 200);
  }
  public async getPastActivityBookingsService(email: string) {
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

    const tickets = await this.ticketModel.find({
      tourist_id: tourist_id,
      type: TicketType.Activity,
      time_to_attend: { $lt: Date.now() },
      cancelled: false,
    });

    if (tickets instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (tickets == null) {
      throw new NotFoundError("Ticket not found");
    }

    const activities = await Promise.all(
      tickets.map((t) => this.activityModel.findById(t.booking_id))
    );

    const bookings: ITicketBooking[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      const activity = activities[i];

      if (activity instanceof Error) {
        throw new InternalServerError(
          "Internal server error while fetching activity"
        );
      }

      if (activity == null) {
        throw new NotFoundError(
          `Activity not found for booking_id: ${t.booking_id}`
        );
      }

      bookings.push({
        type: t.type,
        booking_id: t.booking_id,
        booking_name: activity.name, // Use the activity name
        price: t.price,
        cancelled: t.cancelled,
        points_received: t.points_received,
        time_to_attend: t.time_to_attend,
        active: activity.active_flag,
        payment_type: t.payment_type,
        image: activity.image, // Use the activity image
      });
    }
    if (bookings.length == 0) {
      throw new NotFoundError("No past activity bookings found");
    }

    return new response(true, bookings, "Past activity bookings found", 200);
  }
  public async getUpcomingActivityBookingsService(email: string) {
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

    const tickets = await this.ticketModel.find({
      tourist_id: tourist_id,
      type: TicketType.Activity,
      time_to_attend: { $gte: Date.now() },
      cancelled: false,
    });

    if (tickets instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (tickets == null) {
      throw new NotFoundError("Ticket not found");
    }

    const activities = await Promise.all(
      tickets.map((t) => this.activityModel.findById(t.booking_id))
    );

    const bookings: ITicketBooking[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      const activity = activities[i];

      if (activity instanceof Error) {
        throw new InternalServerError(
          "Internal server error while fetching activity"
        );
      }

      if (activity == null) {
        throw new NotFoundError(
          `Activity not found for booking_id: ${t.booking_id}`
        );
      }
      bookings.push({
        ticket_id: t._id as ObjectId,
        type: t.type,
        booking_id: t.booking_id,
        booking_name: activity.name, // Use the activity name
        price: t.price,
        cancelled: t.cancelled,
        points_received: t.points_received,
        time_to_attend: t.time_to_attend,
        active: activity.active_flag,
        payment_type: t.payment_type,
        image: activity.image, // Use the activity image
      });
    }

    if (bookings.length == 0) {
      throw new NotFoundError("No upcoming activity bookings found");
    }

    return new response(
      true,
      bookings,
      "Upcoming activity bookings found",
      200
    );
  }

  public async getPastItineraryBookingsService(email: string) {
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

    const tickets = await this.ticketModel.find({
      tourist_id: tourist_id,
      type: TicketType.Itinerary,
      time_to_attend: { $lt: Date.now() },
      cancelled: false,
    });

    if (tickets instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (tickets == null) {
      throw new NotFoundError("Ticket not found");
    }

    const itineraries = await Promise.all(
      tickets.map((t) => this.itineraryModel.findById(t.booking_id))
    );

    const bookings: ITicketBooking[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      const itinerary = itineraries[i];

      if (itinerary instanceof Error) {
        throw new InternalServerError(
          "Internal server error while fetching itinerary"
        );
      }

      if (itinerary == null) {
        throw new NotFoundError(
          `Itinerary not found for booking_id: ${t.booking_id}`
        );
      }

      bookings.push({
        type: t.type,
        booking_id: t.booking_id,
        booking_name: itinerary.name, // Use the itinerary name
        price: t.price,
        cancelled: t.cancelled,
        points_received: t.points_received,
        active: itinerary.active_flag,
        payment_type: t.payment_type,
        time_to_attend: t.time_to_attend,
      });
    }
    if (bookings.length == 0) {
      throw new NotFoundError("No past itinerary bookings found");
    }

    return new response(true, bookings, "Past itinerary bookings found", 200);
  }

  public async getUpcomingItineraryBookingsService(email: string) {
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

    const tickets = await this.ticketModel.find({
      tourist_id: tourist_id,
      type: TicketType.Itinerary,
      time_to_attend: { $gte: Date.now() },
      cancelled: false,
    });

    if (tickets instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (tickets == null) {
      throw new NotFoundError("Ticket not found");
    }

    const itineraries = await Promise.all(
      tickets.map((t) => this.itineraryModel.findById(t.booking_id))
    );

    const bookings: ITicketBooking[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      const itinerary = itineraries[i];

      if (itinerary instanceof Error) {
        throw new InternalServerError(
          "Internal server error while fetching itinerary"
        );
      }

      if (itinerary == null) {
        throw new NotFoundError(
          `Itinerary not found for booking_id: ${t.booking_id}`
        );
      }

      bookings.push({
        ticket_id: t._id as ObjectId,
        type: t.type,
        booking_id: t.booking_id,
        booking_name: itinerary.name, // Use the itinerary name
        price: t.price,
        cancelled: t.cancelled,
        points_received: t.points_received,
        active: itinerary.active_flag,
        payment_type: t.payment_type,
        time_to_attend: t.time_to_attend,
      });
    }
    if (bookings.length == 0) {
      throw new NotFoundError("No upcoming itinerary bookings found");
    }

    return new response(
      true,
      bookings,
      "Upcoming itinerary bookings found",
      200
    );
  }

  public async getPastHistoricalLocationBookingsService(email: string) {
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

    const tickets = await this.ticketModel.find({
      tourist_id: tourist_id,
      type: TicketType.Historical_Location,
      time_to_attend: { $lt: Date.now() },
      cancelled: false,
    });

    if (tickets instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (tickets == null) {
      throw new NotFoundError("Ticket not found");
    }

    const historicalLocations = await Promise.all(
      tickets.map((t) => this.historical_locationsModel.findById(t.booking_id))
    );

    const bookings: ITicketBooking[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      const historicalLocation = historicalLocations[i];

      if (historicalLocation instanceof Error) {
        throw new InternalServerError(
          "Internal server error while fetching historical location"
        );
      }

      if (historicalLocation == null) {
        throw new NotFoundError(
          `Historical location not found for booking_id: ${t.booking_id}`
        );
      }

      bookings.push({
        type: t.type,
        booking_id: t.booking_id,
        booking_name: historicalLocation.name, // Use the historical location name
        price: t.price,
        cancelled: t.cancelled,
        points_received: t.points_received,
        time_to_attend: t.time_to_attend,
        payment_type: t.payment_type,
        active: historicalLocation.active_flag,
        image: historicalLocation.images[0], // Fetch only first image of historical location
      });
    }
    if (bookings.length == 0) {
      throw new NotFoundError("No past historical location bookings found");
    }

    return new response(
      true,
      bookings,
      "Past historical location bookings found",
      200
    );
  }

  public async getUpcomingHistoricalLocationBookingsService(email: string) {
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

    const tickets = await this.ticketModel.find({
      tourist_id: tourist_id,
      type: TicketType.Historical_Location,
      time_to_attend: { $gte: Date.now() },
      cancelled: false,
    });

    if (tickets instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (tickets == null) {
      throw new NotFoundError("Ticket not found");
    }

    const historicalLocations = await Promise.all(
      tickets.map((t) => this.historical_locationsModel.findById(t.booking_id))
    );

    const bookings: ITicketBooking[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      const historicalLocation = historicalLocations[i];

      if (historicalLocation instanceof Error) {
        throw new InternalServerError(
          "Internal server error while fetching historical location"
        );
      }

      if (historicalLocation == null) {
        throw new NotFoundError(
          `Historical location not found for booking_id: ${t.booking_id}`
        );
      }

      bookings.push({
        ticket_id: t._id as ObjectId,
        type: t.type,
        booking_id: t.booking_id,
        booking_name: historicalLocation.name, // Use the historical location name
        price: t.price,
        cancelled: t.cancelled,
        points_received: t.points_received,
        time_to_attend: t.time_to_attend,
        payment_type: t.payment_type,
        active: historicalLocation.active_flag,
        image: historicalLocation.images[0], // Fetch only first image of historical location
      });
    }
    if (bookings.length == 0) {
      throw new NotFoundError("No upcoming historical location bookings found");
    }

    return new response(
      true,
      bookings,
      "Upcoming historical location bookings found",
      200
    );
  }

  public async getTicketsInTheNext24hours() {
    const now = new Date();
    const next24Hours = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    );
    const activityTickets = await this.ticketModel
      .find({
        time_to_attend: { $gte: now, $lte: next24Hours },
        cancelled: false,
        type: TicketType.Activity,
      })
      .populate("booking_id");

    const itineraryTickets = await this.ticketModel
      .find({
        time_to_attend: { $gte: now, $lte: next24Hours },
        cancelled: false,
        type: TicketType.Itinerary,
      })
      .populate("booking_id");

    const historicalTickets = await this.ticketModel
      .find({
        time_to_attend: { $gte: now, $lte: next24Hours },
        cancelled: false,
        type: TicketType.Historical_Location,
      })
      .populate("booking_id");

    const tickets = [
      ...activityTickets,
      ...itineraryTickets,
      ...historicalTickets,
    ];

    if (tickets instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    return tickets;
  }

  public async showMyTourGuidesService(tourist_id: string) {
    if (!Types.ObjectId.isValid(tourist_id)) {
      throw new BadRequestError("Invalid id ");
    }
    const tourist = await this.touristModel.findById(tourist_id);
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist == null) throw new NotFoundError("Tourist not found");
    const tickets = await this.ticketModel.find({
      tourist_id: new Types.ObjectId(tourist_id),
      type: "ITINERARY",
    });
    if (tickets instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tickets == null) throw new NotFoundError("Tickets not found");
    let tour_guides: any[] = [];
    let users = [];
    let tour_guides_info: ITourGuideInfoOutputDTO[] = [];
    let tour_guide_info: ITourGuideInfoOutputDTO;
    let itinerary: any;
    for (let i = 0; i < tickets.length; i++) {
      itinerary = await this.itineraryModel.findById(tickets[i].booking_id);
      let tour_guide = await this.tour_guideModel.findById({
        _id: itinerary.tour_guide_id,
      });
      if (tour_guide) {
        //check if the tour guide is already in the list
        if (!tour_guides.some((tg) => tg._id.equals(tour_guide._id))) {
          tour_guides.push(tour_guide);
          let user = await this.userModel.findById(tour_guide.user_id);
          users.push(user);
          if (user) {
            tour_guide_info = {
              firstName: user.name.split(" ")[0],
              lastName: user.name.split(" ")[1],
              email: user.email,
              logo: tour_guide.logo,
              iternary_name: itinerary.name,
            };
            tour_guides_info.push(tour_guide_info);
          }
        }
      }
    }
    return new response(true, tour_guides_info, "Tour guides found", 200);
  }
  public async createOrderService(orderData: IOrderCartDTO) {
    const { tourist_id, cart, payment_type, promoCode } = orderData;
    let { cost } = orderData;
    if (!Types.ObjectId.isValid(tourist_id.toString())) {
      throw new BadRequestError("Invalid id ");
    }
    const tourist = await this.touristModel.findById(tourist_id);
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist === null) throw new NotFoundError("Tourist not found");

    if (payment_type === PaymentType.CreditCard) {
      //Sprint 3
    }
    // if(discount){
    //   cost = cost - discount;
    // }Sprint3
    for (const item of cart.items) {
      const { product_id, quantity } = item;
      const product = await this.productModel.findById(product_id);

      if (product instanceof Error)
        throw new InternalServerError("Internal server error");
      if (product === null) throw new NotFoundError("Product not found");
      if (quantity > product.quantity) {
        throw new BadRequestError("Quantity not available to place order");
      }
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        product_id,
        {
          sales: product.sales + quantity,
          quantity: product.quantity - quantity,
          $addToSet: { tourist_id: tourist_id },
        },
        { new: true }
      );
      if (updatedProduct instanceof Error)
        throw new InternalServerError("Internal server error");
      if (updatedProduct == null) throw new NotFoundError("Product not found");
      //check if product is out of stock
      if (updatedProduct.quantity == 0 && product.seller_id) {
        //create a notification for the Seller/admin Both
        let message = `Product ${product.name} with id ${product._id} is out of stock`;
        let title = "Product out of stock";
        //get the seller to see if he is Admin or Seller and bl mara get email
        const seller = await this.sellerModel.findById(product.seller_id);
        if (seller instanceof Error)
          throw new InternalServerError("Internal server error");
        if (seller == null) throw new NotFoundError("Seller not found");
        const user = await this.userModel.findById(seller.user_id);
        if (user instanceof Error)
          throw new InternalServerError("Internal server error");
        if (user == null) throw new NotFoundError("User not found");
        //create notification for seller
        const notificationService = Container.get(NotificationService);
        let newnotification;
        switch (user.role) {
          case UserRoles.Seller:
            newnotification = notificationService.createNotificationService(
              new Types.ObjectId(product.seller_id.toString()),
              message,
              UserRoles.Seller
            );
            if (newnotification instanceof Error)
              throw new InternalServerError("Internal server error");
            if (newnotification == null) {
              throw new BadRequestError("Notification not found");
            }
            break;
          case UserRoles.Admin:
            newnotification = notificationService.createNotificationService(
              new Types.ObjectId(product.seller_id.toString()),
              message,
              UserRoles.Admin
            );
            if (newnotification instanceof Error)
              throw new InternalServerError("Internal server error");
            if (newnotification == null) {
              throw new BadRequestError("Notification not found");
            }
            break;
          default:
            throw new BadRequestError("Invalid role");
        }
        //send Email to the seller
        const mail = notificationService.sendEmailNotificationService(
          title,
          user.email,
          message
        );
        if (mail instanceof Error)
          throw new InternalServerError("Internal server error");
        if (mail == null) {
          throw new BadRequestError("Email not sent");
        }
      }

      //Already handled in frontend but why not
    }

    if (promoCode) {
      const validPromo = await this.isValidCodeService(promoCode);
      if (!validPromo)
        throw new BadRequestError(
          "There was an issue when tyring to check the promo code"
        );
      cost = cost - cost * (validPromo.data.discount_percent / 100);
    }

    const order = new this.orderModel({
      tourist_id: new Types.ObjectId(tourist_id.toString()),
      products: cart,
      date: Date.now(),
      status: OrderStatus.Pending,
      payment_type: payment_type,
      cost: cost,
    });
    await order.save();

    if (order instanceof Error)
      throw new InternalServerError("Internal server error");

    if (order === null) throw new NotFoundError("Order not found");
    const newWallet = tourist.wallet - cost;
    if (newWallet < 0) {
      throw new BadRequestError("Insufficient funds to place order");
    }
    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      tourist_id,
      { wallet: newWallet, $push: { orders: order._id } },
      { new: true }
    );
    if (updatedTourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (updatedTourist == null) throw new NotFoundError("Tourist not found");

    return new response(true, order, "Order placed", 201);
  }

  public async isValidCodeService(code: string): Promise<response> {
    const promoCode = await this.promoCodeModel.findOne({ code });
    if (!promoCode)
      throw new NotFoundError("No such promocode was found with that code");
    const today = new Date();
    if (promoCode.expiry_date < today)
      throw new BadRequestError("Promo code has expired");

    return new response(
      true,
      { valid: true, discount_percent: promoCode.discount },
      "Code is valid!",
      200
    );
  }

  public async getPastOrdersService(email: string) {
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

    const orders = await this.orderModel
      .find({
        tourist_id: tourist._id,
        status: { $in: [OrderStatus.Delivered, OrderStatus.Cancelled] },
      })
      .populate({
        path: "products.items.product_id", // Populate product details
        populate: {
          path: "seller_id", // Populate seller details within product
          select: "logo", // Fetch only the logo field of the seller
        },
      });

    if (orders instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (orders == null) {
      throw new NotFoundError("Order not found");
    }

    return new response(true, orders, "Past orders found", 200);
  }

  public async getCurrentOrdersService(email: string) {
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

    const orders = await this.orderModel
      .find({
        tourist_id: tourist._id,
        status: {
          $in: [
            OrderStatus.Pending,
            OrderStatus.Processing,
            OrderStatus.Shipped,
          ],
        },
      })
      .populate({
        path: "products.items.product_id", // Populate product details
        populate: {
          path: "seller_id", // Populate seller details within product
          select: "logo", // Fetch only the logo field of the seller
        },
      });

    if (orders instanceof Error) {
      throw new InternalServerError("Internal server error");
    }

    if (orders == null) {
      throw new NotFoundError("Order not found");
    }

    return new response(true, orders, "Current orders found", 200);
  }
  public async bookmarkActivityService(email: string, activity_id: string) {
    if (!Types.ObjectId.isValid(activity_id)) {
      throw new BadRequestError("Invalid activity id");
    }
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Tourist,
      status: UserStatus.APPROVED,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");
    const tourist = await this.touristModel.findOne({ user_id: user._id });
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");

    if (tourist == null) throw new NotFoundError("Tourist not found");

    const activity = await this.activityModel.findById(activity_id);

    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");

    if (activity == null) throw new NotFoundError("Activity not found");

    if (activity.active_flag == false)
      throw new BadRequestError("Activity is not active cannot be bookmarked");

    if (activity.inappropriate_flag == true)
      throw new BadRequestError(
        "Activity is inappropriate cannot be bookmarked"
      );
    const activitycheck = await this.bookmark_notifyModel.find({
      activity_id: activity_id,
      tourist_id: tourist._id,
    });
    if (activitycheck.length > 0) {
      throw new BadRequestError("Activity already bookmarked");
    }
    //These checks can be removed because i only want to bookmark the activity to view it later
    const bookmark = new this.bookmark_notifyModel({
      activity_id: activity_id,
      tourist_id: tourist._id,
    });
    await bookmark.save();
    if (bookmark instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, bookmark, "Activity bookmarked", 201);
  }

  public async unbookmarkActivityService(email: string, activity_id: string) {
    if (!Types.ObjectId.isValid(activity_id)) {
      throw new BadRequestError("Invalid activity id");
    }
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Tourist,
      status: UserStatus.APPROVED,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const tourist = await this.touristModel.findOne({ user_id: user._id });
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist == null) throw new NotFoundError("Tourist not found");

    const activity = await this.activityModel.findById(activity_id);
    if (activity instanceof Error)
      throw new InternalServerError("Internal server error");
    if (activity == null) throw new NotFoundError("Activity is not available");

    const bookmark = await this.bookmark_notifyModel.findOneAndDelete({
      activity_id: activity_id,
      tourist_id: tourist._id,
    });
    if (bookmark instanceof Error)
      throw new InternalServerError("Internal server error");
    if (bookmark == null)
      throw new NotFoundError("Bookmark not found to be unbookmarked");

    return new response(true, bookmark, "Activity unbookmarked", 200);
  }

  public async getBookmarkedActivitiesService(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Tourist,
      status: UserStatus.APPROVED,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("User not found");

    const tourist = await this.touristModel.findOne({ user_id: user._id });
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist == null) throw new NotFoundError("Tourist not found");

    const bookmarks = await this.bookmark_notifyModel.find({
      tourist_id: tourist._id,
    });
    if (bookmarks instanceof Error)
      throw new InternalServerError("Internal server error");
    if (bookmarks == null) throw new NotFoundError("Bookmarks not found");

    const bookmarks_info = [];

    for (let i = 0; i < bookmarks.length; i++) {
      const activity = await this.activityModel.findById(
        bookmarks[i].activity_id
      );
      if (activity instanceof Error)
        throw new InternalServerError("Internal server error");
      if (activity == null) throw new NotFoundError("Activity not found");

      bookmarks_info.push({
        name: activity.name,
        image: activity.image,
        date: activity.date,
        time: activity.time,
        price: activity.price,
        price_range: activity.price_range,
        special_discount: activity.special_discount,
        active_flag: activity.active_flag,
        inappropriate_flag: activity.inappropriate_flag,
        booking_flag: activity.booking_flag,
        average_rating: activity.average_rating,
        advertiser_id: activity.advertiser_id,
        category: activity.category,
        comments: activity.comments,
        location: activity.location,
        tags: activity.tags,
      });
    }
    return new response(
      true,
      bookmarks_info,
      "Bookmarked activities found",
      200
    );
  }

  public async addProductToWishlistService(
    email: string,
    productID: Types.ObjectId
  ): Promise<response> {
    const userInfo = await this.userModel.findOne({ email });
    if (!userInfo) throw new NotFoundError("Tourist not found");
    const touristInfo = await this.touristModel.findOne({
      user_id: userInfo._id,
    });
    if (!touristInfo) throw new NotFoundError("Tourist not found");

    // one might ask what is the of this find, why not just directly put the productID
    // my answer dear friend is because the array we push into does not accept Types.ObjectId :)
    const productInfo = await this.productModel.findById(productID);
    if (!productInfo) throw new NotFoundError("Product not found");

    // should be conflict error ):
    if (touristInfo.wishlist.includes(productInfo._id as ObjectId))
      throw new BadRequestError("Product has already been wishlisted");
    touristInfo.wishlist.push(productInfo._id as ObjectId);
    await touristInfo.save();

    return new response(true, {}, "Wishlisted product!", 200);
  }

  public async removeProductFromWishlistService(
    email: string,
    productID: Types.ObjectId
  ): Promise<response> {
    const userInfo = await this.userModel.findOne({ email });
    if (!userInfo) throw new NotFoundError("Tourist not found");
    const touristInfo = await this.touristModel.findOne({
      user_id: userInfo._id,
    });
    if (!touristInfo) throw new NotFoundError("Tourist not found");

    // one might ask what is the of this find, why not just directly put the productID
    // my answer dear friend is because the array we look into does not accept Types.ObjectId :)
    const productInfo = await this.productModel.findById(productID);
    if (!productInfo) throw new NotFoundError("Product not found");

    // should be conflict error ):
    const index = touristInfo.wishlist.indexOf(productInfo._id as ObjectId);
    if (index === -1)
      throw new BadRequestError("Product was not found in wishlist");
    touristInfo.wishlist.splice(index, 1);
    await touristInfo.save();

    return new response(true, {}, "Removed product!", 200);
  }

  public async viewWishlistService(email: string): Promise<response> {
    const userInfo = await this.userModel.findOne({ email });
    if (!userInfo) throw new NotFoundError("Tourist not found");
    const touristInfo = await this.touristModel
      .findOne({ user_id: userInfo._id })
      .populate("wishlist");
    if (!touristInfo) throw new NotFoundError("Tourist not found");

    const wishlist = touristInfo.wishlist;

    return new response(
      true,
      wishlist,
      "Returning product inside wishlist",
      200
    );
  }

  public async addDeliveryAddressService(
    email: string,
    addressInfo: IAddress
  ): Promise<response> {
    const userInfo = await this.userModel.findOne({ email });
    if (!userInfo) throw new NotFoundError("Tourist not found");
    const touristInfo = await this.touristModel.findOne({
      user_id: userInfo._id,
    });
    if (!touristInfo) throw new NotFoundError("Tourist not found");

    const address = await this.addressModel.create(addressInfo);
    if (!address) throw new BadRequestError("The address field was empty");
    // i dont check for duplicates, mostly because amazon doesn't either :)
    // pray this if condition below doesn't break anything
    if (!touristInfo.addresses) touristInfo.addresses = [];
    touristInfo.addresses.push(address._id as ObjectId);
    await touristInfo.save();

    return new response(true, {}, "Added address!", 200);
  }

  public async removeDeliveryAddressService(
    email: string,
    address: ObjectId
  ): Promise<response> {
    const userInfo = await this.userModel.findOne({ email });
    if (!userInfo) throw new NotFoundError("Tourist not found");
    const touristInfo = await this.touristModel.findOne({
      user_id: userInfo._id,
    });
    if (!touristInfo) throw new NotFoundError("Tourist not found");
    if (!address) throw new BadRequestError("The address field was empty");

    // should be conflict error ):
    const index = touristInfo.addresses.indexOf(address);
    if (index === -1)
      throw new BadRequestError(
        "Address was not found in saved addresses, or has already been removed"
      );
    touristInfo.addresses.splice(index, 1);
    await touristInfo.save();

    return new response(true, {}, "Removed address!", 200);
  }

  public async viewDeliveryAddressesService(email: string): Promise<response> {
    const userInfo = await this.userModel.findOne({ email });
    if (!userInfo) throw new NotFoundError("Tourist not found");
    const touristInfo = await this.touristModel
      .findOne({ user_id: userInfo._id })
      .populate("addresses");
    if (!touristInfo) throw new NotFoundError("Tourist not found");

    const addresses = touristInfo.addresses;
    return new response(true, addresses, "Returning addresses", 200);
  }
  //View Order Details
  public async getOrderDetailsService(order_id: string) {
    if (!Types.ObjectId.isValid(order_id)) {
      throw new BadRequestError("Invalid order id");
    }
    const order = await this.orderModel
      .findById(order_id)
      .populate("products.items.product_id");
    if (order instanceof Error)
      throw new InternalServerError("Internal server error");
    if (order == null) throw new NotFoundError("Order not found");
    return new response(true, order, "Order found", 200);
  }
  //Cancel Order
  public async cancelOrderService(order_id: string) {
    if (!Types.ObjectId.isValid(order_id)) {
      throw new BadRequestError("Invalid order id");
    }
    const order = await this.orderModel.findById(order_id);
    if (order instanceof Error)
      throw new InternalServerError("Internal server error");
    if (order == null) throw new NotFoundError("Order not found");
    if (order.status == OrderStatus.Cancelled) {
      throw new BadRequestError("Order already cancelled");
    }
    if (order.status == OrderStatus.Delivered) {
      throw new BadRequestError("Order already delivered");
    }
    const updatedorder = await this.orderModel.findByIdAndUpdate(
      order_id,
      { status: OrderStatus.Cancelled },
      { new: true }
    );
    if (updatedorder instanceof Error)
      throw new InternalServerError("Internal server error");
    if (updatedorder == null) throw new NotFoundError("Order not found");
    //return the money to the tourist in wallet
    const tourist = await this.touristModel.findById(updatedorder.tourist_id);
    if (tourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (tourist == null) throw new NotFoundError("Tourist not found");
    const newWallet = tourist.wallet + updatedorder.cost;
    //update the tourist wallet
    const updatedTourist = await this.touristModel.findByIdAndUpdate(
      updatedorder.tourist_id,
      { wallet: newWallet },
      { new: true }
    );
    if (updatedTourist instanceof Error)
      throw new InternalServerError("Internal server error");
    if (updatedTourist == null) throw new NotFoundError("Tourist not found");
    return new response(true, updatedorder, "Order cancelled", 200);
  }
}

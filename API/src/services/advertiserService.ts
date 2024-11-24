import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import response from "@/types/responses/response";
import Container, { Inject, Service } from "typedi";
import { Types } from "mongoose";
import {
  IAdvertiser,
  IAdvertiserMain,
  IAdvertiserUpdateDTO,
} from "@/interfaces/IAdvertiser";
import User from "@/models/user";
import UserRoles from "@/types/enums/userRoles";
import UserService from "./userService";
import user from "@/api/routes/user";
import bcrypt from "bcryptjs";
import { FileService } from "./fileService";
import { IActivity } from "@/interfaces/IActivity";
import UserStatus from "@/types/enums/userStatus";
import { ISalesReportTotal, ISalesReportTourists } from "@/interfaces/IReport";
import TicketType from "@/types/enums/ticketType";
import tourist from "@/api/routes/tourist";
@Service()
export default class AdvertiserService {
  constructor(
    @Inject("advertiserModel") private advertiserModel: Models.AdvertiserModel,
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel
  ) {}
  //Create Advertiser
  public createAdvertiserService = async (advertiserData: IAdvertiser) => {
    const IUserInputDTO = {
      email: advertiserData.email,
      name: advertiserData.name,
      username: advertiserData.username,
      password: advertiserData.password,
      role: UserRoles.Advertiser,
      phone_number: advertiserData.phone_number,
    };
    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(IUserInputDTO);
    const newUser = new this.userModel(newUserResponse.data);
    const user = await newUser.save();
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    const IAdvertiserCreateDTO = {
      user_id: user._id,
      activities: advertiserData.activities,
      documents_required: advertiserData.documents_required,
      link_to_website: advertiserData.link_to_website,
      hotline: advertiserData.hotline,
      about: advertiserData.about,
      logo: advertiserData.logo,
      company_profile: advertiserData.company_profile,
    };
    const advertiser = await this.advertiserModel.create(IAdvertiserCreateDTO);
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    return new response(true, advertiser, "Advertiser created", 201);
  };

  public createAdvertiserMainDataService = async (
    advertiserData: IAdvertiserMain
  ) => {
    const IUserInputDTO = {
      email: advertiserData.email,
      name: advertiserData.name,
      username: advertiserData.username,
      password: advertiserData.password,
      role: UserRoles.Advertiser,
      phone_number: advertiserData.phone_number,
    };
    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(IUserInputDTO);
    const newUser = new this.userModel(newUserResponse.data);
    const user = await newUser.save();
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    const IAdvertiserCreateDTO = {
      user_id: user._id,
      documents_required: advertiserData.documents_required,
    };

    const advertiser = await this.advertiserModel.create(IAdvertiserCreateDTO);
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    return new response(true, advertiser, "Advertiser created", 201);
  };

  //Get all Advertisers
  public getAllAdvertisersService = async () => {
    const advertisers = await this.advertiserModel.find({});
    if (advertisers instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertisers == null) throw new NotFoundError("No Advertisers Found");
    return new response(true, advertisers, "All Advertisers are fetched", 200);
  };
  //Get Advertiser by Email
  public getAdvertiserByEmailService = async (email: string) => {
    const user = await this.userModel.findOne({
      email: email,
      role: UserRoles.Advertiser,
    });
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");
    if (user == null) throw new NotFoundError("No User Found");
    const advertiser = await this.advertiserModel.findOne({
      user_id: user._id,
    });
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser found", 200);
  };
  //Get Advertiser by ID
  public getAdvertiserByIDService = async (id: string) => {
    const advertiser = await this.advertiserModel.findById(
      new Types.ObjectId(id)
    );
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser found", 200);
  };
  //Get Advertiser by User ID
  public getAdvertiserByUserIDService = async (userID: string) => {
    const advertiser = await this.advertiserModel.findOne({
      user_id: new Types.ObjectId(userID),
    });
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser found", 200);
  };
  //Get Advertiser by Activity ID
  public getAdvertiserByActivityIDService = async (activityID: string) => {
    const advertiser = await this.advertiserModel.findOne({
      activities: new Types.ObjectId(activityID),
    });
    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser found", 200);
  };
  //Update Advertiser
  public updateAdvertiserService = async (
    email: string,
    file: Express.Multer.File,
    advertiserData: IAdvertiserUpdateDTO
  ) => {
    const {
      newEmail,
      name,
      username,
      password,
      phone_number,
      link_to_website,
      hotline,
      about,
      logo,
      company_profile,
    } = advertiserData;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Await bcrypt.hash here
    }

    const checkApprovedUser = await this.userModel.findOne({
      email: email,
      role: UserRoles.Advertiser,
      status: UserStatus.APPROVED,
    });
    if (!checkApprovedUser) {
      throw new ForbiddenError(
        "Advertiser cannot update account because not approved yet"
      );
    }
    const advertiserUser = await this.userModel.findOneAndUpdate(
      { email: email, role: UserRoles.Advertiser },
      {
        email: newEmail,
        name: name,
        username: username,
        password: hashedPassword,
        phone_number: phone_number,
      },
      { new: true }
    );
    if (advertiserUser instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (advertiserUser == null) {
      throw new NotFoundError("No Advertiser with this email");
    }
    const advertiser = await this.advertiserModel.findOneAndUpdate(
      { user_id: advertiserUser._id },
      {
        link_to_website: link_to_website,
        hotline: hotline,
        about: about,
        logo: logo,
        company_profile: company_profile,
      },
      { new: true }
    );

    if (advertiser instanceof Error)
      throw new InternalServerError("Internal server error");
    if (advertiser == null) throw new NotFoundError("No Advertiser Found");
    return new response(true, advertiser, "Advertiser updated", 200);
  };

  public async deleteAdvertiserAccountRequest(email: string): Promise<any> {
    const today = new Date();
    const advertiserUser = await this.userModel.findOne({ email });
    if (!advertiserUser || advertiserUser.role !== UserRoles.Advertiser)
      throw new NotFoundError("Advertiser user account was not found");
    // also whether dates acutally works is up to luck, pray
    const advertiserData = await this.advertiserModel
      .findOne({ user_id: advertiserUser._id })
      .populate({
        path: "activities",
        match: { date: { $gte: today } },
      });

    if (!advertiserData)
      throw new NotFoundError("Advertiser account was not found");

    const bookedItineraries = await this.ticketModel.find({
      booking_id: { $in: advertiserData.activities },
    });
    if (bookedItineraries.length !== 0)
      throw new BadRequestError(
        "There are still upcoming activites that are booked. Cannot delete until these activities are fufilled"
      );

    // the reason for this retarded way of accessing the activities is because typescript complains if we directly derefernce the activities
    // because the interfaces + models are set up in a weird way
    const advertiserActivities = await this.advertiserModel
      .findById(advertiserData._id)
      .select("activities")
      .populate("activities");
    if (advertiserActivities) {
      const activities =
        advertiserActivities.activities as unknown as IActivity[];
      activities.forEach(async (activity) => {
        activity.active_flag = false;
        await activity.save();
      });
    }

    const deletedAdvertiser = await this.advertiserModel.findByIdAndDelete(
      advertiserData._id
    );
    const deletedAdvertiserUser = await this.userModel.findByIdAndDelete(
      advertiserUser._id
    );

    return new response(true, {}, "Advertiser successfully deleted", 200);
  }
  public async getSalesReportService(
    email: string,
    start_date: string,
    end_date: string
  ): Promise<any> {
    const convertDate = (date: string): string => {
      const [day, month, year] = date.split("/");
      return `${month}-${day}-${year}`;
    };

    start_date = start_date ? convertDate(start_date) : start_date;
    end_date = end_date ? convertDate(end_date) : end_date;

    let isoStartDate = start_date ? new Date(start_date) : null;

    let isoEndDate = end_date
      ? new Date(new Date(end_date).setDate(new Date(end_date).getDate() + 1))
      : null;

    const advertiserUser = await this.userModel.findOne({
      email: email,
      role: UserRoles.Advertiser,
    });
    if (!advertiserUser) throw new NotFoundError("User not found");
    const advertiser = await this.advertiserModel.findOne({
      user_id: advertiserUser._id,
    });
    if (!advertiser) throw new NotFoundError("Advertiser not found");

    const activityReport = await this.ticketModel.aggregate([
      // Step 1: Lookup activity details to filter by advertiser_id
      {
        $match: {
          type: TicketType.Activity,
        },
      },
      {
        $lookup: {
          from: "activities", // Collection name for activities
          localField: "booking_id", // booking_id in ticket corresponds to activity _id
          foreignField: "_id",
          as: "activityDetails",
        },
      },

      // Step 2: Filter out tickets that are not linked to the specified advertiser_id
      {
        $match: {
          "activityDetails.advertiser_id": advertiser._id, // Replace advertiserId with the desired ID
        },
      },

      // Step 3: Remove the `activityDetails` array as it is no longer needed
      {
        $set: {
          activityDetails: { $arrayElemAt: ["$activityDetails", 0] }, // Flatten the array
        },
      },

      // Step 4: Group tickets by `booking_id` (filtered by `advertiser_id`)
      {
        $group: {
          _id: "$booking_id",
          tickets: { $push: "$$ROOT" }, // Include all ticket data
          first_buy: { $min: "$createdAt" }, // First purchase date globally
          last_buy: { $max: "$createdAt" }, // Last purchase date globally
        },
      },

      // Step 5: Apply the date filter (affects only tickets for revenue calculation)
      ...(isoStartDate || isoEndDate
        ? [
            {
              $set: {
                tickets: {
                  $filter: {
                    input: "$tickets",
                    as: "ticket",
                    cond: {
                      $and: [
                        isoStartDate
                          ? { $gte: ["$$ticket.createdAt", isoStartDate] }
                          : true,
                        isoEndDate
                          ? { $lte: ["$$ticket.createdAt", isoEndDate] }
                          : true,
                      ],
                    },
                  },
                },
              },
            },
          ]
        : []),

      // Step 6: Recalculate revenue based on the filtered tickets
      {
        $set: {
          revenue: {
            $sum: "$tickets.price", // Sum of prices from the filtered tickets
          },
        },
      },
      {
        $match: {
          revenue: { $gt: 0 },
        },
      },

      // Step 7: Add activity details for output
      {
        $lookup: {
          from: "activities", // Collection name for activities
          localField: "_id",
          foreignField: "_id",
          as: "activityDetails",
        },
      },

      {
        $project: {
          _id: 1,
          name: { $arrayElemAt: ["$activityDetails.name", 0] },
          average_rating: {
            $arrayElemAt: ["$activityDetails.average_rating", 0],
          },
          image: { $arrayElemAt: ["$activityDetails.image", 0] },
          type: TicketType.Activity,
          revenue: 1, // Revenue after filtering
          total_revenue: { $multiply: ["$revenue", 0.1] }, // 10% for admin
          first_buy: 1, // Overall first buy (global, before filter)
          last_buy: 1, // Overall last buy (global, before filter)
          tourist_count: { $size: "$tickets" },
        },
      },
    ]);

    const salesReports: ISalesReportTourists[] = [...activityReport];
    let totalRevenue = 0;
    for (const salesReport of salesReports) {
      totalRevenue += salesReport.total_revenue;
    }
    const salesReportTotal: ISalesReportTotal = { salesReports, totalRevenue };
    return new response(true, salesReportTotal, "Sales report fetched", 200);
  }
}

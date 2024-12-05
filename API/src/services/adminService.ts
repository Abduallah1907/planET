import mongoose, { ObjectId, SortOrder, Types } from "mongoose";
import Container, { Inject, Service } from "typedi";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";
import {
  IAdminUpdateDTO,
  IUserAdminCreateAdminDTO,
  IUserAdminCreateGovernorDTO,
  IUserAdminViewDTO,
  IUserInputDTO,
} from "@/interfaces/IUser";
import {
  InternalServerError,
  HttpError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "@/types/Errors";
import UserService from "./userService";
import bcrypt from "bcryptjs";
import { IComplaint, IComplaintAdminViewDTO } from "@/interfaces/IComplaint";
import ComplaintStatus from "@/types/enums/complaintStatus";
import { dir, time } from "console";
import { ITourist } from "@/interfaces/ITourist";
import { ISalesReport, ISalesReportTotal } from "@/interfaces/IReport";
import TicketType from "@/types/enums/ticketType";

// User related services (delete, view, and create users)

@Service()
export default class AdminService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("categoryModel") private categoryModel: Models.CategoryModel,
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("touristModel") private touristModel: Models.TouristModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("advertiserModel") private adveristerModel: Models.AdvertiserModel,
    @Inject("governorModel") private governorModel: Models.GovernorModel,
    @Inject("activityModel") private activityModel: Models.ActivityModel,
    @Inject("itineraryModel") private itineraryModel: Models.ItineraryModel,
    @Inject("historical_locationModel")
    private historicalLocationsModel: Models.Historical_locationsModel,
    @Inject("productModel") private productModel: Models.ProductModel,
    @Inject("tagModel") private tagModel: Models.TagModel,
    @Inject("complaintModel") private complaintModel: Models.ComplaintModel,
    @Inject("ticketModel") private ticketModel: Models.TicketModel,
    @Inject("orderModel") private orderModel: Models.OrderModel,
    @Inject("promo_codeModel") private promoCodeModel: Models.Promo_codeModel
  ) {}

  public async getUsersService(page: number): Promise<any> {
    const users = await this.userModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .skip((page - 1) * 10);

    const usersOutput: IUserAdminViewDTO[] = users.map(
      (user: {
        _id: any;
        email: any;
        name: any;
        username: any;
        role: any;
        phone_number: any;
        status: any;
        createdAt: any;
        updatedAt: any;
      }) => ({
        _id: user._id as ObjectId,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        phone_number: user.phone_number,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    );

    return new response(true, usersOutput, "Page " + page + " of users", 200);
  }

  public async searchUserService(username: string): Promise<any> {
    const regex = new RegExp(username, "i");
    const users = await this.userModel.find({ username: { $regex: regex } });
    if (users instanceof Error)
      throw new InternalServerError("Internal server error");

    const usersOutput: IUserAdminViewDTO[] = users.map(
      (user: {
        _id: any;
        email: any;
        name: any;
        username: any;
        role: any;
        phone_number: any;
        status: any;
        createdAt: any;
        updatedAt: any;
      }) => ({
        _id: user._id as ObjectId,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        phone_number: user.phone_number,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    );
    return new response(true, usersOutput, "User found", 200);
  }

  public async deleteUserService(email: string): Promise<any> {
    const user = await this.userModel.findOneAndDelete({ email });
    if (!user) throw new HttpError("User not found", 404);

    const role = user.role;
    const user_id = user._id;
    let deletedRole;
    let deletedCreations; // holds any deleted activity/ititerrnary/historical place
    // since extra information related to the user is in other tables, we need to search that table and delete
    // the corresponding id
    switch (role) {
      case UserRoles.Advertiser:
        deletedRole = await this.adveristerModel.findOneAndDelete({ user_id });
        if (deletedRole)
          deletedCreations = await this.activityModel.deleteMany({
            advertiser_id: deletedRole._id,
          });
        break;
      case UserRoles.Seller:
        deletedRole = await this.sellerModel.findOneAndDelete({ user_id });
        if (deletedRole)
          deletedCreations = await this.productModel.deleteMany({
            user_id: deletedRole._id,
          });
        break;
      case UserRoles.TourGuide:
        deletedRole = await this.tourGuideModel.findOneAndDelete({ user_id });
        if (deletedRole)
          deletedCreations = await this.itineraryModel.deleteMany({
            tour_guide_id: deletedRole._id,
          });
        break;
      case UserRoles.Governor:
        deletedRole = await this.governorModel.findOneAndDelete({ user_id });
        if (deletedRole)
          deletedCreations = await this.historicalLocationsModel.deleteMany({
            governor_id: deletedRole._id,
          });
        break;
      case UserRoles.Tourist:
        deletedRole = await this.touristModel.findOneAndDelete({ user_id });
        break;
    }
    if (deletedRole instanceof Error)
      throw new InternalServerError("Internal server error");

    let userOutput: IUserAdminViewDTO = {
      _id: user._id as ObjectId,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      phone_number: user.phone_number,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    if (deletedRole) userOutput = { ...userOutput, ...deletedRole._doc };
    return new response(
      true,
      { ...userOutput },
      "User deleted sucessfully",
      200
    );
  }

  public async createGovernorService(
    governorData: IUserAdminCreateGovernorDTO
  ): Promise<any> {
    // we add the status and role since they are not inputs taken by the user
    const newGovernorUser: IUserInputDTO = {
      name: governorData.name,
      email: governorData.email,
      username: governorData.username,
      phone_number: governorData.phone_number,
      password: governorData.password,
      role: UserRoles.Governor,
    };

    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(
      newGovernorUser
    );

    const newGovernor = await this.governorModel.create({
      user_id: newUserResponse.data._id,
      nation: governorData.nation,
    });

    const governorOutput: IUserAdminViewDTO = {
      _id: newGovernor.user_id as ObjectId,
      email: newGovernorUser.email,
      name: newGovernorUser.name,
      username: newGovernorUser.username,
      role: newGovernorUser.role,
      phone_number: newGovernorUser.phone_number,
      status: newUserResponse.data.status,
      createdAt: newUserResponse.data.createdAt,
      updatedAt: newUserResponse.data.updatedAt,
    };

    return new response(
      true,
      { ...governorOutput, nation: newGovernor.nation },
      "Governor created successfully",
      201
    );
  }

  public async createAdminService(
    adminData: IUserAdminCreateAdminDTO
  ): Promise<any> {
    // we add the status and role since they are not inputs taken by the user
    const newAdminUser: IUserInputDTO = {
      name: adminData.name,
      email: adminData.email,
      username: adminData.username,
      phone_number: adminData.phone_number,
      password: adminData.password,
      role: UserRoles.Admin,
    };

    const userService: UserService = Container.get(UserService);
    const newUserResponse = await userService.createUserService(newAdminUser);

    const adminOutput: IUserAdminViewDTO = {
      _id: newUserResponse.data._id as ObjectId,
      email: newUserResponse.data.email,
      name: newUserResponse.data.name,
      username: newUserResponse.data.username,
      role: newUserResponse.data.role,
      phone_number: newUserResponse.data.phone_number,
      status: newUserResponse.data.status,
      createdAt: newUserResponse.data.createdAt,
      updatedAt: newUserResponse.data.updatedAt,
    };

    //also create a seller from admin to give him access for products like seller
    const newSeller = new this.sellerModel({
      user_id: newUserResponse.data._id,
      documents_required: [],
      logo: null,
      description: "",
      products: [],
    });
    newSeller.save();

    return new response(true, adminOutput, "Admin created successfully", 201);
  }

  public async getUserNumbersService(): Promise<response> {
    const numberOfUsers = await this.userModel.find({}).countDocuments();
    return new response(true, { numberOfUsers }, "Returning user count", 200);
  }
  public async getUserNumbersForYearService(year: number): Promise<response> {
    const usersPerMonth: number[] = [];
    // remember that for month, it is indexed from zero not 1, so we subtract
    for (let i = 0; i < 12; i++) {
      const startOfMonth = new Date(year, i, 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(year, i + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      // console.log("start of month: " + startOfMonth);
      // console.log("end of month: " + endOfMonth);
      const numberOfUsers = await this.userModel
        .find({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } })
        .countDocuments();
      usersPerMonth.push(numberOfUsers);
    }
    return new response(
      true,
      { usersPerMonth },
      "Returning user count of current year",
      200
    );
  }
  // CRUD for categories
  public async createCategoryService(type: string): Promise<any> {
    const category = await this.categoryModel.create({ type });
    if (category instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, category, "Created category successfully", 201);
  }

  public async getCategoriesService(page: number): Promise<any> {
    const categories = await this.categoryModel
      .find({})
      .sort({ type: 1 })
      .limit(10)
      .skip((page - 1) * 10);
    if (categories instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(
      true,
      categories,
      "Page " + page + " of Categories",
      200
    );
  }

  public async updateCategoryService(
    oldType: string,
    newType: string
  ): Promise<any> {
    const updatedCategory = await this.categoryModel.findOneAndUpdate(
      { type: oldType },
      { type: newType },
      { new: true }
    );
    if (updatedCategory instanceof Error)
      throw new InternalServerError("Internal server error");
    if (!updatedCategory) throw new HttpError("Category not found", 404);

    return new response(
      true,
      updatedCategory,
      "Category updated successfully",
      200
    );
  }

  public async deleteCategoryService(type: string): Promise<any> {
    const deletedCategory = await this.categoryModel.findOneAndDelete({
      type: type,
    });

    if (deletedCategory instanceof Error)
      throw new InternalServerError("Internal server error");
    if (!deletedCategory) throw new HttpError("Category not found", 404);

    return new response(
      true,
      deletedCategory,
      "Category deleteted successfully",
      200
    );
  }

  public async createTagService(type: string): Promise<any> {
    const tag = await this.tagModel.create({ type });
    if (tag instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, tag, "Created tag successfully", 201);
  }

  public async getTagsService(page: number): Promise<any> {
    const tags = await this.tagModel
      .find({})
      .sort({ type: 1 })
      .limit(10)
      .skip((page - 1) * 10);
    if (tags instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, tags, "Page " + page + " of tags", 200);
  }

  public async updateTagService(
    oldType: string,
    newType: string
  ): Promise<any> {
    const updatedTag = await this.tagModel.findOneAndUpdate(
      { type: oldType },
      { type: newType },
      { new: true }
    );
    if (updatedTag instanceof Error)
      throw new InternalServerError("Internal server error");
    if (!updatedTag) throw new HttpError("Tag not found", 404);

    return new response(true, updatedTag, "Tag updated successfully", 200);
  }

  public async deleteTagService(type: String): Promise<any> {
    //search for tag by name
    const tag = await this.tagModel.findOne({ type });
    //remove this tag from all activities
    //find in the tag array of activities and pull this tag from the array
    const activities = await this.activityModel.updateMany(
      { tags: { $in: [tag?._id] } },
      { $pull: { tags: tag?._id } }
    );
    if (activities instanceof Error)
      throw new InternalServerError("Internal server error");
    //remove this tag from all itineraries
    const itineraries = await this.itineraryModel.updateMany(
      { tags: { $in: [tag?._id] } },
      { $pull: { tags: tag?._id } }
    );

    const deletedTag = await this.tagModel.findOneAndDelete({ type });

    if (deletedTag instanceof Error)
      throw new InternalServerError("Internal server error");
    if (!deletedTag) throw new HttpError("Tag not found", 404);

    return new response(true, deletedTag, "Tag deleted successfully", 200);
  }

  public async acceptUserService(email: string): Promise<any> {
    const user = await this.userModel.findOneAndUpdate(
      { email: email },
      { status: UserStatus.APPROVED },
      { new: true }
    );

    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    if (!user) throw new NotFoundError("User not found");

    if (user.status != UserStatus.WAITING_FOR_APPROVAL) {
      throw new BadRequestError(
        "User must be waiting for approval to be accepted"
      );
    }

    if (
      user.role !== UserRoles.Seller &&
      user.role !== UserRoles.TourGuide &&
      user.role !== UserRoles.Advertiser
    ) {
      throw new BadRequestError(
        "User must be a Seller, TourGuide, or Advertiser to be accepted"
      );
    }

    const userAccepted = await this.userModel.findOneAndUpdate(
      { email: email },
      { status: UserStatus.APPROVED },
      { new: true }
    );

    if (userAccepted instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, userAccepted, "User accepted", 200);
    // TODO
  }

  public async rejectUserService(email: string): Promise<any> {
    const user = await this.userModel.findOneAndUpdate(
      { email: email },
      { status: UserStatus.REJECTED },
      { new: true }
    );
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    if (!user) throw new NotFoundError("User not found");

    if (user.status != UserStatus.WAITING_FOR_APPROVAL) {
      throw new BadRequestError(
        "User must be waiting for approval to be accepted"
      );
    }
    if (
      user.role !== UserRoles.Seller &&
      user.role !== UserRoles.TourGuide &&
      user.role !== UserRoles.Advertiser
    ) {
      throw new BadRequestError(
        "User must be a Seller, TourGuide, or Advertiser to be accepted"
      );
    }

    const userRejected = await this.userModel.findOneAndUpdate(
      { email: email },
      { status: UserStatus.REJECTED },
      { new: true }
    );

    if (userRejected instanceof Error)
      throw new InternalServerError("Internal server error");

    return new response(true, userRejected, "User rejected", 200);

    // TODO
  }

  public async updateAdminService(
    email: string,
    AdminUpdateDTO: IAdminUpdateDTO
  ) {
    const { newEmail, name, phone_number, password } = AdminUpdateDTO;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Await bcrypt.hash here
    }
    const user = await this.userModel.findOneAndUpdate(
      { email: email, role: UserRoles.Admin },
      {
        email: newEmail,
        name: name,
        phone_number: phone_number,
        password: hashedPassword,
      },
      { new: true }
    );
    if (user instanceof Error)
      throw new InternalServerError("Internal server error");

    if (!user) throw new NotFoundError("User not found");

    return new response(true, user, "Admin password updated", 200);
  }

  // COMPLAINTS API
  public async getComplaintsService(): Promise<response> {
    const complaints: IComplaint[] = await this.complaintModel
      .find({})
      .populate({
        path: "tourist_id",
        populate: { path: "user_id", select: "name" },
        select: "tourist_id",
      });
    const complaintsOutput: IComplaintAdminViewDTO[] = complaints.map(
      (complaint) => ({
        date: complaint.date,
        status: complaint.status,
        title: complaint.title,
        complaint_id: complaint._id as ObjectId,
        tourist_name: complaint.tourist_id,
        body: complaint.body,
        reply: complaint.reply,
        createdAt: complaint.createdAt,
      })
    );
    return new response(true, complaintsOutput, "Complaints are fetched", 200);
  }

  public async getComplaintByIDService(
    complaintID: Types.ObjectId
  ): Promise<response> {
    const complaint: IComplaint | null = await this.complaintModel
      .findById(complaintID)
      .populate({
        path: "tourist_id",
        populate: { path: "user_id", select: "name" },
        select: "tourist_id",
      });
    if (!complaint) throw new NotFoundError("No such complaint found");

    const complaintOutput: IComplaintAdminViewDTO = {
      date: complaint.date,
      status: complaint.status,
      title: complaint.title,
      complaint_id: complaint._id as ObjectId,
      tourist_name: complaint.tourist_id,
      body: complaint.body,
      reply: complaint.reply,
      createdAt: complaint.createdAt,
    };

    return new response(true, complaintOutput, "Complaint is fetched", 200);
  }

  public async markComplaintResolvedService(
    complaintID: Types.ObjectId
  ): Promise<response> {
    const complaint: IComplaint | null =
      await this.complaintModel.findByIdAndUpdate(complaintID, {
        status: ComplaintStatus.Resolved,
      });
    if (!complaint) throw new NotFoundError("No such complaint found");
    return new response(true, {}, "Complaint status updated to resolved!", 200);
  }

  public async markComplaintPendingService(
    complaintID: Types.ObjectId
  ): Promise<response> {
    const complaint: IComplaint | null =
      await this.complaintModel.findByIdAndUpdate(complaintID, {
        status: ComplaintStatus.Pending,
      });
    if (!complaint) throw new NotFoundError("No such complaint found");
    return new response(true, {}, "Complaint status updated to pending!", 200);
  }

  public async replyComplaintService(
    complaintID: Types.ObjectId,
    complaintReply: string
  ): Promise<response> {
    if (!complaintReply)
      throw new BadRequestError("pls reply with complaint reply");
    const complaint: IComplaint | null =
      await this.complaintModel.findByIdAndUpdate(complaintID, {
        reply: complaintReply,
      });
    if (!complaint) throw new NotFoundError("No such complaint found");
    return new response(true, {}, "Added complaint reply!", 200);
  }

  public async getSortedComplaintsByDateService(
    direction: SortOrder,
    page: number
  ): Promise<response> {
    if (!direction)
      throw new BadRequestError(
        "Choose either -1 or 1 as your direction for sorting"
      );
    const sortedComplaints = await this.complaintModel
      .find({})
      .populate({
        path: "tourist_id",
        populate: { path: "user_id", select: "name" },
        select: "tourist_id",
      })
      .sort({ date: direction })
      .limit(10)
      .skip((page - 1) * 10);

    const sortedComplaintsDTO: IComplaintAdminViewDTO[] = sortedComplaints.map(
      (complaint) => ({
        date: complaint.date,
        status: complaint.status,
        title: complaint.title,
        complaint_id: complaint._id as ObjectId,
        tourist_name: complaint.tourist_id,
        body: complaint.body,
        reply: complaint.reply,
        createdAt: complaint.createdAt,
      })
    );
    return new response(true, sortedComplaintsDTO, "Compliants sorted!", 200);
  }

  public async filerComplaintByStatusService(
    status: ComplaintStatus,
    page: number
  ): Promise<response> {
    if (!status || !Object.values(ComplaintStatus).includes(status))
      throw new BadRequestError("pls add a correct status to filter by");
    const filteredComplaints = await this.complaintModel
      .find({ status })
      .populate({
        path: "tourist_id",
        populate: { path: "user_id", select: "name" },
        select: "tourist_id",
      })
      .limit(10)
      .skip((page - 1) * 10);

    const filteredComplaintsDTO: IComplaintAdminViewDTO[] =
      filteredComplaints.map((complaint) => ({
        date: complaint.date,
        status: complaint.status,
        title: complaint.title,
        complaint_id: complaint._id as ObjectId,
        tourist_name: complaint.tourist_id,
        body: complaint.body,
        reply: complaint.reply,
        createdAt: complaint.createdAt,
      }));

    return new response(
      true,
      filteredComplaintsDTO,
      "Filtered complaints",
      200
    );
  }

  public async createPromoCodeService(
    duration: number,
    discount: number
  ): Promise<response> {
    if (duration <= 0 || !duration)
      throw new BadRequestError("The duration must be a postive number");
    if (discount > 100 || !discount)
      throw new BadRequestError(
        "This discount inserted is greater than 100 or the discount was not entered. Do you want us to give them money? :)"
      );
    // another solution is to use the objectID as our code, but that won't be very user friendly
    let randomCode;
    while (true) {
      randomCode = (Math.random() + 1).toString(36).substring(2);
      const codeAlreadyExists = await this.promoCodeModel.findOne({
        code: randomCode,
      });
      console.log(codeAlreadyExists);
      if (!codeAlreadyExists) break;
    }
    const expiry_date = new Date();
    expiry_date.setHours(23, 59, 59, 999);
    expiry_date.setDate(expiry_date.getDate() + duration);
    await this.promoCodeModel.create({
      code: randomCode,
      expiry_date,
      discount,
    });

    return new response(
      true,
      { promoCode: randomCode },
      "Code successfully generated!",
      200
    );
  }

  // this service is not called yet (le8yat mafahem law momken el frontend yeinsert el string lel promocode zay nafso wala la2)
  // (a use case for frontend creating the code themselves is for birthdays, so it has the user's name instead of a random string)
  public async createPromoCodeWithCodeSerivceforlogin(
    duration: number,
    discount: number,
    promoCode: string
  ) {
    if (duration <= 0 || !duration)
      throw new BadRequestError("The duration must be a postive number");
    if (discount > 100 || !discount)
      throw new BadRequestError(
        "This discount inserted is greater than 100 or the discount was not entered. Do you want us to give them money? :)"
      );
    // another solution is to use the objectID as our code, but that won't be very user friendly
    const codeAlreadyExists = await this.promoCodeModel.findOne({
      code: promoCode,
    });
    if (codeAlreadyExists) return;
    const expiry_date = new Date();
    expiry_date.setHours(23, 59, 59, 999);
    expiry_date.setDate(expiry_date.getDate() + duration);
    await this.promoCodeModel.create({
      code: promoCode,
      expiry_date,
      discount,
    });

    return new response(
      true,
      { promoCode: promoCode },
      "Code successfully generated!",
      200
    );
  }
  public async getSalesReportService(start_date: string, end_date: string) {
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

    const activityAndItineraryReport = await this.ticketModel.aggregate([
      // Step 1: Calculate overall first_buy and last_buy globally
      {
        $group: {
          _id: "$booking_id",
          tickets: { $push: "$$ROOT" }, // Include all ticket data
          first_buy: { $min: "$createdAt" }, // First purchase date globally
          last_buy: { $max: "$createdAt" }, // Last purchase date globally
        },
      },

      // Step 2: Apply the date filter (affects only tickets for revenue calculation)
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

      // Step 3: Recalculate revenue based on the filtered tickets
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
      // Step 4: Lookup activity and itinerary details
      {
        $lookup: {
          from: "activities", // Collection name for activities
          localField: "_id",
          foreignField: "_id",
          as: "activityDetails",
        },
      },
      {
        $lookup: {
          from: "itineraries", // Collection name for itineraries
          localField: "_id",
          foreignField: "_id",
          as: "itineraryDetails",
        },
      },

      // Step 5: Flatten activity and itinerary details for output
      {
        $project: {
          _id: 1,
          name: {
            $cond: [
              { $gt: [{ $size: "$activityDetails" }, 0] },
              { $arrayElemAt: ["$activityDetails.name", 0] },
              { $arrayElemAt: ["$itineraryDetails.name", 0] },
            ],
          },
          average_rating: {
            $cond: [
              { $gt: [{ $size: "$activityDetails" }, 0] },
              { $arrayElemAt: ["$activityDetails.average_rating", 0] },
              { $arrayElemAt: ["$itineraryDetails.average_rating", 0] },
            ],
          },
          image: {
            $cond: [
              { $gt: [{ $size: "$activityDetails" }, 0] },
              { $arrayElemAt: ["$activityDetails.image", 0] },
              { $arrayElemAt: ["$itineraryDetails.image", 0] },
            ],
          },
          type: {
            $cond: [
              { $gt: [{ $size: "$activityDetails" }, 0] },
              "ACTIVITY",
              "ITINERARY",
            ],
          },
          revenue: 1, // Revenue after filtering
          total_revenue: { $multiply: ["$revenue", 0.1] }, // 10% for admin
          first_buy: 1, // Overall first buy (global, before filter)
          last_buy: 1, // Overall last buy (global, before filter)
        },
      },
    ]);
    const productReport = await this.orderModel.aggregate([
      // Step 1: Unwind the items array to process each product separately
      {
        $unwind: "$products.items",
      },

      // Step 2: Lookup product details from the Product collection
      {
        $lookup: {
          from: "products", // Product collection name
          localField: "products.items.product_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Step 3: Flatten the productDetails array
      {
        $unwind: "$productDetails",
      },

      // Step 4: Group to calculate global first_buy and last_buy for each product
      {
        $group: {
          _id: "$productDetails._id", // Group by product ID
          name: { $first: "$productDetails.name" },
          average_rating: { $first: "$productDetails.average_rating" },
          image: { $first: "$productDetails.image" },
          first_buy: { $min: "$createdAt" }, // Earliest purchase date
          last_buy: { $max: "$createdAt" }, // Latest purchase date
          orders: { $push: "$$ROOT" }, // Collect all order details
        },
      },

      // Step 5: Re-process the orders to apply the date range filter
      {
        $project: {
          _id: 1,
          name: 1,
          average_rating: 1,
          image: 1,
          first_buy: 1,
          last_buy: 1,
          orders: {
            $filter: {
              input: "$orders",
              as: "order",
              cond: {
                $and: [
                  isoStartDate
                    ? { $gte: ["$$order.createdAt", isoStartDate] }
                    : true,
                  isoEndDate
                    ? { $lte: ["$$order.createdAt", isoEndDate] }
                    : true,
                ],
              },
            },
          },
        },
      },

      // Step 6: Flatten the filtered orders back for revenue calculation
      {
        $unwind: "$orders",
      },

      // Step 7: Calculate revenue for each filtered order
      {
        $project: {
          _id: 1,
          name: 1,
          average_rating: 1,
          image: 1,
          first_buy: 1,
          last_buy: 1,
          revenue: {
            $multiply: [
              "$orders.products.items.quantity",
              "$orders.productDetails.price",
            ],
          },
        },
      },

      // Step 8: Group again to sum up total revenue for each product
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          average_rating: { $first: "$average_rating" },
          image: { $first: "$image" },
          first_buy: { $first: "$first_buy" }, // Use the first grouping results
          last_buy: { $first: "$last_buy" }, // Use the first grouping results
          revenue: { $sum: "$revenue" }, // Sum up the revenue
        },
      },

      // Step 9: Final projection
      {
        $project: {
          _id: 1,
          name: 1,
          average_rating: 1,
          image: 1,
          type: "PRODUCT",
          revenue: 1,
          total_revenue: { $multiply: ["$revenue", 0.1] }, // 10% for admin
          first_buy: 1,
          last_buy: 1,
        },
      },
    ]);

    const salesReports: ISalesReport[] = [
      ...activityAndItineraryReport,
      ...productReport,
    ];
    let totalRevenue = 0;
    for (const salesReport of salesReports) {
      totalRevenue += salesReport.total_revenue;
    }
    const salesReportTotal: ISalesReportTotal = { salesReports, totalRevenue };
    return new response(
      true,
      salesReportTotal,
      "Sales report generated successfully",
      200
    );
  }
}

import mongoose from "mongoose";
import { Inject, Service } from "typedi";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";
import { IUserAdminCreateAdminDTO, IUserAdminCreateGovernorDTO, IUserAdminViewDTO } from "@/interfaces/IUser";
import { InternalServerError, HttpError, BadRequestError } from "@/types/Errors";

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
    @Inject("historical_locationModel") private historicalLocationsModel: Models.Historical_locationsModel,
    @Inject("productModel") private productModel: Models.ProductModel
  ) {}

  public async getUsersService(page: number): Promise<any> {
    const users = await this.userModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .skip((page - 1) * 10);

    const usersOutput: IUserAdminViewDTO[] = users.map(
      (user: { _id: any; email: any; name: any; username: any; role: any; phone_number: any; status: any; createdAt: any; updatedAt: any }) => ({
        _id: user._id,
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
    if (users instanceof Error) throw new InternalServerError("Internal server error");

    const usersOutput: IUserAdminViewDTO[] = users.map(
      (user: { _id: any; email: any; name: any; username: any; role: any; phone_number: any; status: any; createdAt: any; updatedAt: any }) => ({
        _id: user._id,
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

  public async deleteUserService(_id: mongoose.Types.ObjectId): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(_id.toString())) throw new BadRequestError("_id is invalid");

    const user = await this.userModel.findByIdAndDelete(_id);
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
        if (deletedRole) deletedCreations = await this.activityModel.deleteMany({ advertiser_id: deletedRole._id });
        break;
      case UserRoles.Seller:
        deletedRole = await this.sellerModel.findOneAndDelete({ user_id });
        if (deletedRole) deletedCreations = await this.productModel.deleteMany({ user_id: deletedRole._id });
        break;
      case UserRoles.TourGuide:
        deletedRole = await this.tourGuideModel.findOneAndDelete({ user_id });
        if (deletedRole) deletedCreations = await this.itineraryModel.deleteMany({ tour_guide_id: deletedRole._id });
        break;
      case UserRoles.Governor:
        deletedRole = await this.governorModel.findOneAndDelete({ user_id });
        if (deletedRole) deletedCreations = await this.historicalLocationsModel.deleteMany({ governor_id: deletedRole._id });
        break;
      case UserRoles.Tourist:
        deletedRole = await this.touristModel.findOneAndDelete({ user_id });
        break;
    }

    const userOutput: IUserAdminViewDTO = {
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      phone_number: user.phone_number,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return new response(true, { ...userOutput, deletedRole: deletedRole._doc, deletedCreations }, "User deleted", 200);
  }

  public async createGovernorService(governorData: IUserAdminCreateGovernorDTO): Promise<any> {
    // we add the status and role since they are not inputs taken by the user
    const newGovernorUser = new this.userModel({ ...governorData, status: UserStatus.APPROVED, role: UserRoles.Governor });
    // the reason we dont call user service to create the admin is because the user service DTO does
    // not expect status as one of its attributes, so we have to do it ourselves

    if (newGovernorUser instanceof Error) throw new InternalServerError("Internal server error");
    if (!newGovernorUser) throw new HttpError("Governor not created", 404);

    await newGovernorUser.save();
    const newGovernor = await this.governorModel.create({ user_id: newGovernorUser._id, nation: governorData.nation });

    const governorOutput: IUserAdminViewDTO = {
      _id: newGovernorUser._id,
      email: newGovernorUser.email,
      name: newGovernorUser.name,
      username: newGovernorUser.username,
      role: newGovernorUser.role,
      phone_number: newGovernorUser.phone_number,
      status: newGovernorUser.status,
      createdAt: newGovernorUser.createdAt,
      updatedAt: newGovernorUser.updatedAt,
    };

    return new response(true, { ...governorOutput, nation: newGovernor.nation }, "Governor created", 201);
  }

  public async createAdminService(adminData: IUserAdminCreateAdminDTO): Promise<any> {
    // we add the status and role since they are not inputs taken by the user
    const newAdmin = new this.userModel({ ...adminData, status: UserStatus.APPROVED, role: UserRoles.Admin });
    // the reason we dont call user service to create the admin is because the user service DTO does
    // not expect status as one of its attributes, so we have to do it ourselves

    if (newAdmin instanceof Error) throw new InternalServerError("Internal server error");
    if (!newAdmin) throw new HttpError("Admin not created", 404);

    await newAdmin.save();
    const adminOutput: IUserAdminViewDTO = {
      _id: newAdmin._id,
      email: newAdmin.email,
      name: newAdmin.name,
      username: newAdmin.username,
      role: newAdmin.role,
      phone_number: newAdmin.phone_number,
      status: newAdmin.status,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    };
    return new response(true, adminOutput, "Admin created", 201);
  }

  // CRUD for categories
  public async createCategoryService(type: string): Promise<any> {
    const category = await this.categoryModel.create({ type });
    if (category instanceof Error) throw new InternalServerError("Internal server error");
    if (!category) throw new HttpError("Category not found", 404);

    return new response(true, category, "Created new category!", 201);
  }

  public async getCategoriesService(page: number): Promise<any> {
    const categories = await this.categoryModel
      .find({})
      .sort({ type: 1 })
      .limit(10)
      .skip((page - 1) * 10);
    if (categories instanceof Error) throw new InternalServerError("Internal server error");

    return new response(true, categories, "Page " + page + " of Categories", 200);
  }

  public async updateCategoryService(oldType: string, newType: string): Promise<any> {
    const updatedCategory = await this.categoryModel.findOneAndUpdate({ type: oldType }, { type: newType }, { new: true });
    if (updatedCategory instanceof Error) throw new InternalServerError("Internal server error");
    if (!updatedCategory) throw new HttpError("Category not found", 404);

    return new response(true, updatedCategory, "Category updated!", 200);
  }

  public async deleteCategoryService(type: string): Promise<any> {
    const deletedCategory = await this.categoryModel.findOneAndDelete({ type: type });

    if (deletedCategory instanceof Error) throw new InternalServerError("Internal server error");
    if (!deletedCategory) throw new HttpError("Category not found", 404);

    return new response(true, deletedCategory, "Category deleted!", 200);
  }
}

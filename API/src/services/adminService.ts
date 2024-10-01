import mongoose from "mongoose";
import Container, { Inject, Service } from "typedi";
import response from "@/types/responses/response";
import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";
import { IUserAdminCreateDTO, IUserAdminViewDTO, IUserInputDTO } from "@/interfaces/IUser";
import { InternalServerError, HttpError } from "@/types/Errors";
import UserService from "./userService";
import admin from "@/api/routes/admin";

// User related services (delete, view, and create users)

@Service()
export default class AdminService {
  constructor(
    @Inject("userModel") private userModel: Models.UserModel,
    @Inject("categoryModel") private categoryModel: Models.CategoryModel,
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("touristModel") private touristModel: Models.TouristModel,
    @Inject("tour_guideModel") private tourGuideModel: Models.Tour_guideModel,
    @Inject("advertiserModel") private adveristerModel: Models.AdvertiserModel
  ) {}

  public async getUsersService(page: number): Promise<any> {
    const users = await this.userModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .skip((page - 1) * 10);

    const usersOutput: IUserAdminViewDTO[] = users.map(
      (user: { email: any; name: any; username: any; role: any; phone_number: any; status: any; createdAt: any; updatedAt: any }) => ({
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
      (user: { email: any; name: any; username: any; role: any; phone_number: any; status: any; createdAt: any; updatedAt: any }) => ({
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

  public async deleteUserService(_id: mongoose.ObjectId): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(_id.toString())) throw new InternalServerError("_id is invalid");

    const user = await this.userModel.findByIdAndDelete(_id);
    if (!user) throw new HttpError("User not found", 404);

    const role = user.role;
    const user_id = user._id;
    let deletedRole;
    // since extra information related to the user is in other tables, we need to search that table and delete
    // the corresponding id
    switch (role) {
      case UserRoles.Advertiser:
        deletedRole = this.adveristerModel.findOneAndDelete({ user_id });
        break;
      case UserRoles.Seller:
        deletedRole = this.sellerModel.findOneAndDelete({ user_id });
        break;
      case UserRoles.TourGuide:
        deletedRole = this.tourGuideModel.findOneAndDelete({ user_id });
        break;
      case UserRoles.Tourist:
        deletedRole = this.touristModel.findOneAndDelete({ user_id });
        break;
    }

    const userOutput: IUserAdminViewDTO = {
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      phone_number: user.phone_number,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return new response(true, { ...userOutput, ...deletedRole }, "User deleted", 200);
  }

  public async createGovernorService(governorData: IUserAdminCreateDTO): Promise<any> {
    // we add the status and role since they are not inputs taken by the user
    const newGovernor = new this.userModel({ ...governorData, status: UserStatus.APPROVED, role: UserRoles.Governor });
    // the reason we dont call user service to create the admin is because the user service DTO does
    // not expect status as one of its attributes, so we have to do it ourselves

    if (newGovernor instanceof Error) throw new InternalServerError("Internal server error");
    if (!newGovernor) throw new HttpError("Governor not created", 404);

    await newGovernor.save();
    const governorOutput: IUserAdminViewDTO = {
      email: newGovernor.email,
      name: newGovernor.name,
      username: newGovernor.username,
      role: newGovernor.role,
      phone_number: newGovernor.phone_number,
      status: newGovernor.status,
      createdAt: newGovernor.createdAt,
      updatedAt: newGovernor.updatedAt,
    };
    return new response(true, governorOutput, "Governor created", 200);
  }

  public async createAdminService(adminData: IUserAdminCreateDTO): Promise<any> {
    // we add the status and role since they are not inputs taken by the user
    const newAdmin = new this.userModel({ ...adminData, status: UserStatus.APPROVED, role: UserRoles.Admin });
    // the reason we dont call user service to create the admin is because the user service DTO does
    // not expect status as one of its attributes, so we have to do it ourselves

    if (newAdmin instanceof Error) throw new InternalServerError("Internal server error");
    if (!newAdmin) throw new HttpError("Admin not created", 404);

    await newAdmin.save();
    const adminOutput: IUserAdminViewDTO = {
      email: newAdmin.email,
      name: newAdmin.name,
      username: newAdmin.username,
      role: newAdmin.role,
      phone_number: newAdmin.phone_number,
      status: newAdmin.status,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    };
    return new response(true, adminOutput, "Admin created", 200);
  }

  // CRUD for categories
  public async createCategoryService(type: string): Promise<any> {
    const category = await this.categoryModel.create({ type });
    if (category instanceof Error) throw new InternalServerError("Internal server error");
    if (!category) throw new HttpError("Category not found", 404);

    return new response(true, category, "Created new category!", 200);
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

import mongoose from "mongoose";
import User from "../models/user";
import Category from "../models/Category";
import response from "@/types/response/response";
import UserRoles from "@/types/enums/userRoles";
import UserStatus from "@/types/enums/userStatus";
import { IUserAdminViewDTO } from "@/interfaces/IUser";

// User related services (delete, view, and create users)

export default class AdminService {
  constructor() {}

  public async getUsersService(page: number): Promise<any> {
    if (!page) throw new Error("No page number was found");
    const users = await User.find({}, "name username email role phone_number status createdAt updatedAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .skip((page - 1) * 10);
    return new response(true, users, "Page " + page + " of users", 200);
  }

  public async searchUserService(username: string): Promise<any> {
    if (!username) throw new Error("Username is required");
    const regex = new RegExp(username, "i");
    const user = await User.find({ username: { $regex: regex } }, "name username email role phone_number status createdAt updatedAt");

    return new response(true, user, "User found", 200);
  }

  public async deleteUserService(_id: mongoose.ObjectId): Promise<any> {
    if (!_id) throw new Error("_id is required");
    if (!mongoose.Types.ObjectId.isValid(_id.toString())) throw new Error("_id is invalid");

    const user = await User.findByIdAndDelete(_id).select("name username email role phone_number status createdAt updatedAt");
    if (!user) throw new Error("User not found");
    return new response(true, user, "Deleted user", 200);
  }

  public async createGovernorService(email: string, name: string, phone_number: string, username: string, password: string): Promise<any> {
    if (!email || !name || !phone_number || !username || !password) throw new Error("One of the fields is empty");
    const governor = await User.create({
      username,
      email,
      name,
      phone_number,
      password,
      role: UserRoles.Governor,
      status: UserStatus.APPROVED,
    });
    return new response(true, { _id: governor._id, username }, "Created new governor!", 200);
  }

  public async createAdminService(email: string, name: string, phone_number: string, username: string, password: string): Promise<any> {
    if (!email || !name || !phone_number || !username || !password) throw new Error("One of the fields is empty");
    const admin = await User.create({
      username,
      email,
      name,
      phone_number,
      password,
      role: UserRoles.Admin,
      status: UserStatus.APPROVED,
    });
    return new response(true, { _id: admin._id, username }, "Created new admin!", 200);
  }

  // CRUD for categories
  public async createCategoryService(type: string): Promise<any> {
    const category = await Category.create({ type });
    return new response(true, category, "Created new category!", 200);
  }

  public async getCategoriesService(page: number): Promise<any> {
    if (!page) throw new Error("No page number was found");
    const categories = await Category.find({})
      .sort({ type: 1 })
      .limit(10)
      .skip((page - 1) * 10);
    return new response(true, categories, "Page " + page + " of Categories", 200);
  }

  public async updateCategoryService(oldType: string, newType: string): Promise<any> {
    if (!oldType || !newType) throw new Error("The category name is empty");
    const updatedCategory = await Category.findOneAndUpdate({ type: oldType }, { type: newType }, { new: true });
    if (!updatedCategory) throw new Error("Category name not found");
    return new response(true, updatedCategory, "Category updated!", 200);
  }

  public async deleteCategoryService(type: string): Promise<any> {
    if (!type) throw new Error("The category name is empty");
    const deletedCategory = await Category.findOneAndDelete({ type: type });
    if (!deletedCategory) throw new Error("Category name not found");
    return new response(true, deletedCategory, "Category deleted!", 200);
  }
}

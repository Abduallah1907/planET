import mongoose from "mongoose";
import User from "../models/user";
import Category from "../models/Category";
import response from "@/types/responce/response";
import UserRoles from "@/types/enums/userRoles";

// User related services (delete, view, and create users)

export const getUsersService = async (page: number): Promise<any> => {
  if (!page) throw new Error("No page number was found");
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .skip((page - 1) * 10);
  return new response(true, users, "Page " + page + " of users", 200);
};

export const getUserService = async (username: string): Promise<any> => {
  const user = await User.find({ username: username });
  if (!user) throw new Error("User not found");
  return new response(true, user, "User found", 200);
};

export const deleteUserService = async (
  id: mongoose.ObjectId
): Promise<any> => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return new response(true, user, "Deleted user", 200);
};

export const createGovernorService = async (
  email: string,
  name: string,
  phone_number: string,
  username: string,
  password: string
): Promise<any> => {
  const governor = await User.create({
    username,
    email,
    name,
    phone_number,
    password,
    role: UserRoles.Governor,
  });
  return new response(true, governor, "Created new governor!", 200);
};

export const createAdminService = async (
  email: string,
  name: string,
  phone_number: string,
  username: string,
  password: string
): Promise<any> => {
  const admin = await User.create({
    username,
    email,
    name,
    phone_number,
    password,
    role: UserRoles.Admin,
  });
  return new response(true, admin, "Created new governor!", 200);
};

// CRUD for categories
export const createCategoryService = async (type: string): Promise<any> => {
  const category = await Category.create({ type });
  return new response(true, category, "Created new category!", 200);
};

export const getCategoriesService = async (page: number): Promise<any> => {
  if (!page) throw new Error("No page number was found");
  const categories = await Category.find({})
    .sort({ type: 1 })
    .limit(10)
    .skip((page - 1) * 10);
  return new response(true, categories, "Page " + page + " of Categories", 200);
};

export const updateCategoryService = async (
  oldType: string,
  newType: string
): Promise<any> => {
  if (!oldType || !newType) throw new Error("The category name is empty");
  const updatedCategory = await Category.findOneAndUpdate(
    { type: oldType },
    { type: newType },
    { new: true }
  );
  return new response(true, updatedCategory, "Category updated!", 200);
};

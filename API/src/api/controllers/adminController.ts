import {
  getUsersService,
  getUserService,
  deleteUserService,
  createGovernorService,
  createCategoryService,
  getCategoriesService,
  updateCategoryService,
  deleteCategoryService,
} from "@/services/adminService";
import { Request, Response } from "express";

// CRUD for users
export const getUsers = async (req: Request, res: Response): Promise<any> => {
  const { page } = req.body;
  const users = await getUsersService(page);
  res.json({ users });
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const { username } = req.body;
  const user = await getUserService(username);
  res.json({ user });
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.body;
  const user = await deleteUserService(id);
  res.json({ user });
};

export const createGovernor = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, name, phone_number, username, password } = req.body;
  const newGovernor = await createGovernorService(
    email,
    name,
    phone_number,
    username,
    password
  );
  res.json({ newGovernor });
};

export const createAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, name, phone_number, username, password } = req.body;
  const newAdmin = await createGovernorService(
    email,
    name,
    phone_number,
    username,
    password
  );
  res.json({ newAdmin });
};

// --------------------
// CRUD for categories

export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { type } = req.body;
  const newCategory = await createCategoryService(type);
  res.json({ newCategory });
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { page } = req.body;
  const categories = await getCategoriesService(page);
  res.json({ categories });
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { oldType, newType } = req.body;
  const updatedCategory = await updateCategoryService(oldType, newType);
  res.json({ updatedCategory });
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { type } = req.body;
  const deletedCategory = await deleteCategoryService(type);
  res.json({ deletedCategory });
};

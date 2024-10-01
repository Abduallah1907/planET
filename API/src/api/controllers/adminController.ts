import { IUserAdminCreateDTO } from "@/interfaces/IUser";
import AdminService from "@/services/adminService";
import { Request, Response } from "express";
import Container, { Inject, Service } from "typedi";

// CRUD for users
@Service()
export class AdminController {
  public async getUsers(req: Request, res: Response): Promise<any> {
    const { page } = req.body;
    const adminService: AdminService = Container.get(AdminService);
    const users = await adminService.getUsersService(page);
    res.json({ users });
  }

  public async searchUser(req: Request, res: Response): Promise<any> {
    const { username } = req.body;
    const adminService: AdminService = Container.get(AdminService);
    const user = await adminService.searchUserService(username);
    res.json({ user });
  }

  public async deleteUser(req: Request, res: Response): Promise<any> {
    const { _id } = req.body;
    const adminService: AdminService = Container.get(AdminService);
    const user = await adminService.deleteUserService(_id);
    res.json({ user });
  }

  public async createGovernor(req: Request, res: Response): Promise<any> {
    const governorData = req.body as IUserAdminCreateDTO;
    const adminService: AdminService = Container.get(AdminService);
    const newGovernor = await adminService.createGovernorService(governorData);
    res.json({ newGovernor });
  }

  public async createAdmin(req: Request, res: Response): Promise<any> {
    const adminData = req.body as IUserAdminCreateDTO;
    const adminService: AdminService = Container.get(AdminService);
    const newAdmin = await adminService.createAdminService(adminData);
    res.json({ newAdmin });
  }

  // --------------------
  // CRUD for categories

  public async createCategory(req: Request, res: Response): Promise<any> {
    const { type } = req.body;
    const adminService: AdminService = Container.get(AdminService);
    const newCategory = await adminService.createCategoryService(type);
    res.json({ newCategory });
  }

  public async getCategories(req: Request, res: Response): Promise<any> {
    const { page } = req.body;
    const adminService: AdminService = Container.get(AdminService);
    const categories = await adminService.getCategoriesService(page);
    res.json({ categories });
  }

  public async updateCategory(req: Request, res: Response): Promise<any> {
    const { oldType, newType } = req.body;
    const adminService: AdminService = Container.get(AdminService);
    const updatedCategory = await adminService.updateCategoryService(oldType, newType);
    res.json({ updatedCategory });
  }

  public async deleteCategory(req: Request, res: Response): Promise<any> {
    const { type } = req.body;
    const adminService: AdminService = Container.get(AdminService);
    const deletedCategory = await adminService.deleteCategoryService(type);
    res.json({ deletedCategory });
  }
}

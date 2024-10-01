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
    // const { email, name, phone_number, username, password }=req.body;
    // const newGovernor = await this.adminService.createGovernorService(email, name, phone_number, username, password);
    // res.json({ newGovernor });
  }

  public async createAdmin(req: Request, res: Response): Promise<any> {
    // const { email, name, phone_number, username, password }req.body;
    // const newAdmin = await this.adminService.createAdminService(email, name, phone_number, username, password);
    // res.json({ newAdmin });
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

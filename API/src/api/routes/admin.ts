import { Request, Response, Router, NextFunction } from "express";
import middlewares from "../middlewares";
import adminService from "../../services/adminService";

const router = Router();
// all routes have /api/admin before each route

// This returns all users given a page number
// Each page has 10 users
router.get("/getUsers", async (req: Request, res: Response): Promise<any> => {
  const { page } = req.body;
  const adminServiceInstance = new adminService();
  const users = await adminServiceInstance.getUsers(page);
  res.json({ success: true, data: users }).status(201);
});

// This searches by exact username;
// a nice TODO would be to have it search by similarity
router.get("/searchUser", async (req: Request, res: Response): Promise<any> => {
  const { username } = req.body;
  const adminServiceInstance = new adminService();
  const user = await adminServiceInstance.searchUser(username);
  if (!user)
    return res.status(404).json({ success: false, message: "No such user" });
  res.json({ success: true, data: user }).status(201);
});

// Given an ID, it deletes the user if the id is valid and returns
// the deleted user information
// TODO remove password as one of the things returned
router.delete(
  "/deleteUser",
  middlewares.validUserID,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    const adminServiceInstance = new adminService();
    try {
      const user = await adminServiceInstance.deleteUser(id);
      res.json({ success: true, data: user }).status(201);
    } catch (e) {
      res.status(404).json({ success: false, message: "No such user" });
    }
  }
);

// Given an email, name, phone number, username, and password,
// automatically creates the account and returns the newly created governor
router.post(
  "/createGovernor",
  async (req: Request, res: Response): Promise<any> => {
    const { email, name, phone_number, username, password } = req.body;
    const adminServiceInstance = new adminService();
    try {
      const newGovernor = await adminServiceInstance.createGovernor(
        email,
        name,
        phone_number,
        username,
        password
      );
      res.status(201).json({ success: true, data: newGovernor });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  }
);

// Given an email, name, phone number, username, and password,
// automatically creates the account and returns the newly created admin
router.post(
  "/createAdmin",
  async (req: Request, res: Response): Promise<any> => {
    const { email, name, phone_number, username, password } = req.body;
    const adminServiceInstance = new adminService();
    try {
      const newAdmin = await adminServiceInstance.createAdmin(
        email,
        name,
        phone_number,
        username,
        password
      );
      res.status(201).json({ success: true, data: newAdmin });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  }
);

router.post(
  "/createCategory",
  async (req: Request, res: Response): Promise<any> => {
    const { type } = req.body;
    const adminServiceInstance = new adminService();
    try {
      const newCategory = await adminServiceInstance.createCategory(type);
      res.status(201).json({ success: true, data: newCategory });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  }
);

router.get(
  "/getCategories",
  async (req: Request, res: Response): Promise<any> => {
    const { page } = req.body;
    const adminServiceInstance = new adminService();
    try {
      const categories = await adminServiceInstance.getCategories(page);
      res.status(201).json({ success: true, data: categories });
    } catch (e: any) {
      res.status(404).json({ success: false, message: e.message });
    }
  }
);

export default router;

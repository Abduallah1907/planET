import { Request, Response, NextFunction } from "express";
import express from "express";
import User from "@/models/user";
import middlewares from "../middlewares";
import adminService from "../../services/adminService";

const router = express.Router();
// all routes have /api/admin before each route

// This returns all users
// TODO paginate this
router.get("/getUsers", async (req: Request, res: Response): Promise<any> => {
  const adminServiceInstance = new adminService();
  const users = await adminServiceInstance.getUsers();
  res.json(users).status(200);
});

// This searches by exact username;
// a nice TODO would be to have it search by similarity
router.get("/searchUser", async (req: Request, res: Response): Promise<any> => {
  const { username } = req.body;
  const adminServiceInstance = new adminService();
  const user = await adminServiceInstance.searchUser(username);
  if (!user) res.json({ error: "No such user found" }).status(404);
  res.json(user).status(200);
});

// Given an ID, it deletes the user if the id is valid and returns
// the deleted user information
router.delete(
  "/deleteUser",
  middlewares.validUserID,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    const adminServiceInstance = new adminService();
    try {
      const user = await adminServiceInstance.deleteUser(id);
      res.status(200).json(user);
    } catch (e) {
      return res.status(404).json({ error: "No such user" });
    }
  }
);

export default router;

import { Request, Response, Router, NextFunction } from "express";
import middlewares from "../middlewares";
import {
  getUsers,
  getUser,
  deleteUser,
  createGovernor,
  createAdmin,
  getCategories,
} from "../controllers/adminController";

const router = Router();
// all routes have /api/admin before each route

export default (app: Router) => {
  app.use("/admin", router);

  // This returns all users given a page number
  // Each page has 10 users
  router.get("/getUsers", getUsers);

  // This searches by exact username;
  // a nice TODO would be to have it search by similarity
  router.get("/searchUser", getUser);

  // Given an ID, it deletes the user if the id is valid and returns
  // the deleted user information
  // TODO remove password as one of the things returned
  router.delete("/deleteUser", middlewares.validUserID, deleteUser);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created governor
  router.post("/createGovernor", createGovernor);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created admin
  router.post("/createAdmin", createAdmin);

  // Give any string, it will create a new category
  router.post("/createCategory", createGovernor);

  // Given a page number, it will return a list containing 10 categories
  router.get("/getCategories", getCategories);
};

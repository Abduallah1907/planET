import { Request, Response, Router, NextFunction } from "express";
import middlewares from "../middlewares";
import {
  getUsers,
  searchUser,
  deleteUser,
  createGovernor,
  createAdmin,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/adminController";

const router = Router();
// all routes have /api/admin before each route

export default (app: Router) => {
  app.use("/admin", router);

  // This returns all users given a page number
  // Each page has 10 users
  router.get("/getUsers", getUsers);

  // This searches by exact username; if no username is found it returns empty data
  // i.e it does not throw an error
  // returns all users that have a matching username and excludes information about the salt and password
  // a nice TODO would be to have it ID
  router.get("/searchUser", searchUser);

  // Given an ID, it deletes the user if the id is valid and returns
  // the deleted user information (excluding information about the salt and password)
  router.delete("/deleteUser", deleteUser);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created governor
  // (excluding information about the salt and password)
  router.post("/createGovernor", createGovernor);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created admin
  // (excluding information about the salt and password)
  router.post("/createAdmin", createAdmin);

  // Give any string, it will create a new category
  router.post("/createCategory", createGovernor);

  // Given a page number, it will return a list containing 10 categories
  router.get("/getCategories", getCategories);

  // Given an two category names, it will update the first category name
  // and have its name be the second category name
  // if the category does not exist, it throws an error
  router.put("/updateCategory", updateCategory);

  // Given a category name, it will delete the category
  router.delete("/deleteCategory", deleteCategory);
};

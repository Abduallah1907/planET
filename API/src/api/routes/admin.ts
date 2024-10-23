import { Router } from "express";
import Container from "typedi";
import { AdminController } from "@/api/controllers/adminController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
import User from "@/models/user";
const router = Router();
// all routes have /api/admin before each route

export default (app: Router) => {
  const adminController: AdminController = Container.get(AdminController);
  app.use("/admin", router);
  app.use("/admin", authorize([]), router);
  // This returns all users given a page number
  // Each page has 10 users
  router.get("/getUsers/:page", authorize([]), adminController.getUsers);

  // This searches by exact username; if no username is found it returns empty data
  // i.e it does not throw an error
  // returns all users that have a matching username and excludes information about the salt and password
  // a nice TODO would be to have it ID
  router.get("/searchUser/:username", authorize([]), adminController.searchUser);

  // Given an ID, it deletes the user if the email is valid and returns
  // the deleted user information (excluding information about the salt and password)
  router.delete("/deleteUser/:email", authorize([]), adminController.deleteUser);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created governor
  // (excluding information about the salt and password)
  router.post("/createGovernor", authorize([]), adminController.createGovernor);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created admin
  // (excluding information about the salt and password)
  router.post("/createAdmin", authorize([]), adminController.createAdmin);

  // Give any string, it will create a new category
  router.post("/createCategory", authorize([]), adminController.createCategory);

  // Given a page number, it will return a list containing 10 categories
  router.get("/getCategories/:page", adminController.getCategories);

  // Given an two category names, it will update the first category name
  // and have its name be the second category name
  // if the category does not exist, it throws an error
  router.put("/updateCategory", authorize([]), adminController.updateCategory);

  // Given a category name, it will delete the category
  router.delete("/deleteCategory/:type", authorize([]), adminController.deleteCategory);

  router.post("/createTag", authorize([]), adminController.createTag);
  router.get("/getTags/:page", adminController.getTags);
  router.put("/updateTag", authorize([]), adminController.updateTag);
  router.delete("/deleteTag/:type", authorize([]), adminController.deleteTag);

  router.put("/acceptUser/:email", authorize([]), adminController.acceptUser);

  router.put("/rejectUser/:email", authorize([]), adminController.rejectUser);

  router.put("/updateAdmin/:email", authorize([]), adminController.updateAdmin);

  // COMPLAINTS
  router.get("/getComplaints/:page", adminController.getComplaints);
  router.get("/getComplaintByID/:complaint_id", adminController.getComplaintByID);
  router.put("/markComplaintResolved/:complaint_id", adminController.markComplaintResolved);
  router.put("/markComplaintPending/:complaint_id", adminController.markComplaintPending);
  router.put("/replyComplaint/:complaint_id", adminController.replyComplaint);
};

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
  /**
   * @swagger
   * info:
   *   title: Admin API
   *   version: 1.0.0
   *   description: API for managing users and categories in the admin panel.
   * servers:
   *   - url: http://localhost:3000/api/admin
   * tags:
   *   - name: Users
   *     description: Operations related to user management.
   *   - name: Categories
   *     description: Operations related to category management.
   *   - name: Admin
   *     description: Admin related operations.
   *
   * paths:
   *   /api/admin/getUsers/{page}:
   *     get:
   *       tags:
   *         - Admin
   *       summary: Retrieve a list of 10 users according to page number.
   *       parameters:
   *         - name: page
   *           in: path
   *           description: Page number to retrieve (default is 1).
   *           required: false
   *           schema:
   *             type: integer
   *             default: 1
   *       responses:
   *         '200':
   *           description: A list of users.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/admin/searchUser/{username}:
   *     get:
   *       tags:
   *         - Admin
   *       summary: Search for a user by username.
   *       parameters:
   *         - name: username
   *           in: path
   *           description: Username to search for.
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: User found or empty data.
   *         '404':
   *           description: User not found.
   *
   *   /api/admin/deleteUser/{email}:
   *     delete:
   *       tags:
   *         - Admin
   *       summary: Delete a user by email.
   *       parameters:
   *         - name: email
   *           in: path
   *           description: Email of the user to be deleted.
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: User deleted successfully.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/admin/createGovernor:
   *     post:
   *       tags:
   *         - Admin
   *       summary: Create a new governor account.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                 name:
   *                   type: string
   *                 phone:
   *                   type: string
   *                 username:
   *                   type: string
   *                 password:
   *                   type: string
   *                 nation:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Governor created successfully.
   *         '400':
   *           description: Invalid input.
   *
   *   /api/admin/createAdmin:
   *     post:
   *       tags:
   *         - Admin
   *       summary: Create a new admin account.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                 name:
   *                   type: string
   *                 phone:
   *                   type: string
   *                 username:
   *                   type: string
   *                 password:
   *                   type: string
   *                 nation:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Admin created successfully.
   *         '400':
   *           description: Invalid input.
   *
   *   /api/admin/createCategory:
   *     post:
   *       tags:
   *         - Categories
   *       summary: Create a new category.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Category created successfully.
   *         '400':
   *           description: Invalid input.
   *
   *   /api/admin/getCategories/{page}:
   *     get:
   *       tags:
   *         - Categories
   *       summary: Retrieve a paginated list of categories.
   *       parameters:
   *         - name: page
   *           in: path
   *           description: Page number to retrieve (default is 1).
   *           required: false
   *           schema:
   *             type: integer
   *             default: 1
   *       responses:
   *         '200':
   *           description: A list of categories.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/admin/updateCategory:
   *     put:
   *       tags:
   *         - Categories
   *       summary: Update an existing category name.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 oldType:
   *                   type: string
   *                 newType:
   *                   type: string
   *       responses:
   *         '200':
   *           description: Category updated successfully.
   *         '404':
   *           description: Category not found.
   *         '400':
   *           description: Invalid input.
   *
   *   /api/admin/deleteCategory/{type}:
   *     delete:
   *       tags:
   *         - Categories
   *       summary: Delete a category by name.
   *       parameters:
   *         - name: type
   *           in: path
   *           description: Name of the category to be deleted.
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Category deleted successfully.
   *         '404':
   *           description: Category not found.
   *
   *   /api/admin/createTag:
   *     post:
   *       tags:
   *         - Tags
   *       summary: Create a new tag.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *       responses:
   *         '201':
   *           description: Tag created successfully.
   *         '400':
   *           description: Invalid input.
   *
   *   /api/admin/getTags/{page}:
   *     get:
   *       tags:
   *         - Tags
   *       summary: Retrieve a paginated list of tags.
   *       parameters:
   *         - name: page
   *           in: path
   *           description: Page number to retrieve (default is 1).
   *           required: false
   *           schema:
   *             type: integer
   *             default: 1
   *       responses:
   *         '200':
   *           description: A list of tags.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/admin/updateTag:
   *     put:
   *       tags:
   *         - Tags
   *       summary: Update an existing tag name.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 oldType:
   *                   type: string
   *                 newType:
   *                   type: string
   *       responses:
   *         '200':
   *           description: Tag updated successfully.
   *         '404':
   *           description: Tag not found.
   *         '400':
   *           description: Invalid input.
   *
   *   /api/admin/deleteTag/{type}:
   *     delete:
   *       tags:
   *         - Tags
   *       summary: Delete a tag by name.
   *       parameters:
   *         - name: type
   *           in: path
   *           description: Name of the tag to be deleted.
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Tag deleted successfully.
   *         '404':
   *           description: Tag not found.
   */
  // This returns all users given a page number
  // Each page has 10 users
  router.get("/getUsers/:page", authorize([]), adminController.getUsers);

  // This searches by exact username; if no username is found it returns empty data
  // i.e it does not throw an error
  // returns all users that have a matching username and excludes information about the salt and password
  // a nice TODO would be to have it ID
  router.get(
    "/searchUser/:username",
    authorize([]),
    adminController.searchUser
  );

  // Given an ID, it deletes the user if the email is valid and returns
  // the deleted user information (excluding information about the salt and password)
  router.delete(
    "/deleteUser/:email",
    authorize([]),
    adminController.deleteUser
  );

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
  router.delete(
    "/deleteCategory/:type",
    authorize([]),
    adminController.deleteCategory
  );

  router.post("/createTag", authorize([]), adminController.createTag);
  router.get("/getTags/:page", adminController.getTags);
  router.put("/updateTag", authorize([]), adminController.updateTag);
  router.delete("/deleteTag/:type", authorize([]), adminController.deleteTag);
};

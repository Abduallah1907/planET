import { Router } from "express";
import Container from "typedi";
import { AdminController } from "@/api/controllers/adminController";
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
   *     description: x
   *
   * paths:
   *   # User Operations
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     email:
   *                       type: string
   *                       example: Metfasa7@gmail.com
   *                     name:
   *                       type: string
   *                       example: Medhat
   *                     username:
   *                       type: string
   *                       example: MedhatMetfasa7
   *                     role:
   *                       type: string
   *                       example: TOURIST
   *                     phone_number:
   *                       type: string
   *                       example: 011111
   *                     status:
   *                       type: string
   *                       example: APPROVED
   *                       enum:
   *                         - APPROVED
   *                         - WAITING_FOR_APPROVAL
   *                         - REJECTED
   *                     createdAt:
   *                       type: string
   *                       example: 2024-10-01T09:36:47.869Z
   *                     updatedAt:
   *                       type: string
   *                       example: 2024-10-01T09:36:47.869Z
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/admin/searchUser/{username}:
   *     get:
   *       tags:
   *         - Users
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   user:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       username:
   *                         type: string
   *                       email:
   *                         type: string
   *         '404':
   *           description: User not found.
   *
   *   /api/admin/deleteUser/{id}:
   *     delete:
   *       tags:
   *         - Users
   *       summary: Delete a user by ID.
   *       parameters:
   *         - name: id
   *           in: path
   *           description: ID of the user to delete.
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: User deleted successfully.
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   deletedUser:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       username:
   *                         type: string
   *                       email:
   *                         type: string
   *         '400':
   *           description: _id is Invalid
   *         '404':
   *           description: User not found.
   *         '500':
   *           description: Internal Server Error.
   *
   *   /api/admin/createGovernor:
   *     post:
   *       tags:
   *         - Users
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
   *       responses:
   *         '201':
   *           description: Governor created successfully.
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   governor:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       username:
   *                         type: string
   *                       email:
   *                         type: string
   *         '400':
   *           description: Invalid input.
   *
   *   /api/admin/createAdmin:
   *     post:
   *       tags:
   *         - Users
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
   *       responses:
   *         '201':
   *           description: Admin created successfully.
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   admin:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       username:
   *                         type: string
   *                       email:
   *                         type: string
   *         '400':
   *           description: Invalid input.
   *
   *   # Category Operations
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   category:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         format: ObjectId
   *                       type:
   *                         type: string
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       format: ObjectId
   *                     type:
   *                       type: string
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                     format: ObjectId
   *                   type:
   *                     type: string
   *
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   type:
   *                    type: string
   *                   _id:
   *                    type: string
   *                    format: ObjectId
   *         '404':
   *           description: Category not found.
   *   # Tag Operations
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   tag:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         format: ObjectId
   *                       name:
   *                         type: string
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       format: ObjectId
   *                     type:
   *                       type: string
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   type:
   *                     type: string
   *                   _id:
   *                     type: string
   *                     format: ObjectId
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
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   type:
   *                     type: string
   *                   _id:
   *                     type: string
   *                     format: ObjectId
   *         '404':
   *           description: Tag not found.
   */
  // This returns all users given a page number
  // Each page has 10 users
  router.get("/getUsers/:page", adminController.getUsers);

  // This searches by exact username; if no username is found it returns empty data
  // i.e it does not throw an error
  // returns all users that have a matching username and excludes information about the salt and password
  // a nice TODO would be to have it ID
  router.get("/searchUser/:username", adminController.searchUser);

  // Given an ID, it deletes the user if the id is valid and returns
  // the deleted user information (excluding information about the salt and password)
  router.delete("/deleteUser/:email", adminController.deleteUser);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created governor
  // (excluding information about the salt and password)
  router.post("/createGovernor", adminController.createGovernor);

  // Given an email, name, phone number, username, and password,
  // automatically creates the account and returns the newly created admin
  // (excluding information about the salt and password)
  router.post("/createAdmin", adminController.createAdmin);

  // Give any string, it will create a new category
  router.post("/createCategory", adminController.createCategory);

  // Given a page number, it will return a list containing 10 categories
  router.get("/getCategories/:page", adminController.getCategories);

  // Given an two category names, it will update the first category name
  // and have its name be the second category name
  // if the category does not exist, it throws an error
  router.put("/updateCategory", adminController.updateCategory);

  // Given a category name, it will delete the category
  router.delete("/deleteCategory/:type", adminController.deleteCategory);

  router.post("/createTag", adminController.createTag);
  router.get("/getTags/:page", adminController.getTags);
  router.put("/updateTag", adminController.updateTag);
  router.delete("/deleteTag/:type", adminController.deleteTag);
};

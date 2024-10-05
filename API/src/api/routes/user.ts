import { Router, Request, Response } from "express";
import { UserController } from "@/api/controllers/userController";
import Container from "typedi";

const route = Router();

export default (app: Router) => {
  const userController: UserController = Container.get(UserController);

  app.use("/users", route);
  /**
   * @swagger
   * tags:
   *   - name: Users
   *     description: User management and retrieval
   *
   * paths:
   *   /api/users/test:
   *     get:
   *       tags:
   *         - Users
   *       summary: Retrieve a list of users
   *       description: Retrieve a list of users from the database
   *       responses:
   *         200:
   *           description: A list of users.
   *
   *   /api/users/createUser:
   *     post:
   *       tags:
   *         - Users
   *       summary: Create a new user
   *       description: Create a new user in the database
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/IUserInputDTO'
   *       responses:
   *         200:
   *           description: User created.
   *         400:
   *           description: Bad request.
   *         500:
   *           description: Internal server error.
   *
   *   /api/users/loginUser:
   *     get:
   *       tags:
   *         - Users
   *       summary: Login user
   *       description: Login user in the system
   *       parameters:
   *         - in: query
   *           name: username
   *           schema:
   *             type: string
   *         - in: query
   *           name: email
   *           schema:
   *             type: string
   *         - in: query
   *           name: password
   *           required: true
   *           schema:
   *             type: string
   *       responses:
   *         200:
   *           description: User logged in.
   *         400:
   *           description: Bad request.
   *         500:
   *           description: Internal server error.
   *
   * components:
   *   schemas:
   *     IUserInputDTO:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *         username:
   *           type: string
   *         email:
   *           type: string
   *         password:
   *           type: string
   *         role:
   *           type: string
   *           enum:
   *             - Admin
   *             - User
   *             - Guest
   *         phone_number:
   *           type: string
   *         date_of_birth:
   *           type: string
   *           format: date
   */

  route.get("/test", userController.test);
  route.post("/createUser", userController.createUser);
  route.get("/loginUser", userController.loginUser);
};

import { Router, Request, Response } from "express";
import { UserController } from "@/api/controllers/userController";
import Container from "typedi";

const route = Router();

export default (app: Router) => {
  const userController: UserController = Container.get(UserController);

  app.use("/users", route);
  route.get("/test", userController.test);
  route.post("/createUser", userController.createUser);
  route.get("/loginUser", userController.loginUser);
  route.get("/forgetPassword/:email", userController.forgetPassword);

  route.put("/updateGovernor/:email", userController.updateGovernor);
};

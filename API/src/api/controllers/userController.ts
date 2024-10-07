import { Request, Response } from "express";
import UserService from "@/services/userService";
import Container, { Inject, Service } from "typedi";
import { IUser, IUserInputDTO } from "@/interfaces/IUser";

@Service()
export class UserController {
  public async test(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: "User test" });
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    const userService: UserService = Container.get(UserService);
    const userData = req.body as IUserInputDTO;
    const user = await userService.createUserService(userData);
    res.status(user.status).json(user);
  }

  public async loginUser(req: any, res: any) {
    const loginData = req.query as IUserInputDTO;
    const userService: UserService = Container.get(UserService);
    const user = await userService.loginUserService(loginData);
    res.status(user.status).json(user);
  }
}

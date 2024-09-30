import { Request, Response } from "express";
import UserService from "@/services/userService";
import Container, { Inject, Service } from "typedi";
import { IUserInputDTO } from "@/interfaces/IUser";

@Service()
export class UserController {
  public async test(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: "User test" });
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    const userService: UserService = Container.get(UserService);
    const userData = req.body as IUserInputDTO;
    const user = await userService.createUserService(userData);
    res.status(user.status).json({ user });
  }
}

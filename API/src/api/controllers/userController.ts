import { Request, Response } from "express";
import UserService from "@/services/userService";
import Container, { Inject, Service } from "typedi";
import { IGovernorUpdateDTO, IUser, IUserInputDTO } from "@/interfaces/IUser";

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

  public async forgetPassword(req: any, res: any) {
    const userService: UserService = Container.get(UserService);
    const { email } = req.params;
    console.log("Email controller", email);
    const user = await userService.forgetPasswordService(email);
    res.status(user.status).json(user);
  }
  public async updateGovernor(req: any, res: any) {
    const userService: UserService = Container.get(UserService);
    const { email } = req.params;
    const governorUpdateData: IGovernorUpdateDTO = req.body;
    const user = await userService.updateGovernorService(
      email,
      governorUpdateData
    );
    res.status(user.status).json(user);
  }

  public async requestOTP(req: any, res: any){
    const userService: UserService = Container.get(UserService);
    const { email } = req.params;
    const user = await userService.requestOTPService(email);
    res.status(user.status).json(user);
  }

  public async verifyOTP(req: any, res: any){
    const userService: UserService = Container.get(UserService);
    const { email, otp } = req.params;
    const user = await userService.verifyOTPService(email, otp);
    res.status(user.status).json(user);
  }

  public async resetPassword(req: any, res: any){
    const userService: UserService = Container.get(UserService);
    const { email} = req.params;
    const { password, otp } = req.body;
    const user = await userService.resetPasswordService(email, password, otp);
    res.status(user.status).json(user);
  }

}

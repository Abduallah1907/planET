import { Request, Response } from 'express';
import UserService from "@/services/userService"
import { Inject, Service } from 'typedi';
import { IUserInputDTO } from '@/interfaces/IUser';

@Service('userController')
export class UserController {
    constructor(
        @Inject('userService') private userService: UserService
    ) {
    }

    public async test(req: Request, res: Response): Promise<void> {
        res.status(200).json({message: "User test"});
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        const userData = req.body as IUserInputDTO;
        const user = await this.userService.createUserService(userData);
        res.status(user.status).json({user});
    }
}

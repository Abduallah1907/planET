import { Request, Response } from 'express';
import user from '../routes/user';
import {createUserService} from "@/services/userService"

class UserController {
    public test(req: Request, res: Response): void {
        res.send('Test method in UserController is working!');
    }
}


export const createUser = async (req: any, res: any) => {
    const user = await createUserService(req.body.name,req.body.username,req.body.email,req.body.password,req.body.phone_number,req.body.date_of_birth);
    res.json({user});

};

export default new UserController();
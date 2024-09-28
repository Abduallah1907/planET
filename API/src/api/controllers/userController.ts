import { Request, Response } from 'express';

class UserController {
    public test(req: Request, res: Response): void {
        res.send('Test method in UserController is working!');
    }
}

export default new UserController();
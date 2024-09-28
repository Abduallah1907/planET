
import express from 'express';

import { createUser, getUser, updateUser } from "../../controllers/userController";
const userRouter = express.Router();

userRouter.post('/createUser', createUser);
userRouter.get('/getUser', getUser);
userRouter.put('/updateUser', updateUser);


export default userRouter;
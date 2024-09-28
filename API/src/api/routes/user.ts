import { Router, Request, Response } from 'express';
import userController from '../controllers/user';
const route = Router();

export default (app: Router) => {
  app.use('/users', route);
  

  route.get('/test', userController.test);
};
import { Router, Request, Response } from 'express';
import { UserController } from '@/api/controllers/userController';
import Container from 'typedi';
const route = Router();
const userController = Container.get('userController') as UserController;

export default (app: Router) => {

  app.use('/users', route);
   /**
   * @swagger
   * tags:
   *   - name: Users
   *     description: User management and retrieval
   * /api/users/test:
   *   get:
   *     tags:
   *       - Users
   *     summary: Retrieve a list of users
   *     description: Retrieve a list of users from the database
   *     responses:
   *       200:
   *         description: A list of users.
   */
  route.get('/test', userController.test);
};
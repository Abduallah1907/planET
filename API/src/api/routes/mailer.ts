import { Router } from 'express';
import Container from 'typedi';
import { MailerController } from '../controllers/mailerController';

const route = Router();


export default (app: Router) => {

  const mailerController: MailerController = Container.get(MailerController);

  app.use('/mailer', route);
  /**
  * @swagger
  * tags:
  *   - name: Mailer
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
  route.get('/sendWelcomeEmail', mailerController.sendWelcomeMail);
};
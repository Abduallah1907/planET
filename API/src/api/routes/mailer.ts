import { Router } from "express";
import Container from "typedi";
import { MailerController } from "../controllers/mailerController";

const route = Router();

export default (app: Router) => {
  const mailerController: MailerController = Container.get(MailerController);

  app.use("/mailer", route);
  route.get("/sendWelcomeEmail", mailerController.sendWelcomeMail);
};

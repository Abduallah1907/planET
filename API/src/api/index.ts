import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import admin from "./routes/admin";
import tourist from "./routes/tourist";
import mailer from "./routes/mailer";

import activity from "./routes/activity";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  admin(app);
  tourist(app);

  activity(app);
  mailer(app);

  return app;
};

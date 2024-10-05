import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import tourGuide from "./routes/tourGuide";
import admin from "./routes/admin";
import tourist from "./routes/tourist";
import mailer from "./routes/mailer";

import activity from "./routes/activity";
import product from "./routes/product";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourGuide(app);
  admin(app);
  tourist(app);

  activity(app);
  mailer(app);
  product(app);

  return app;
};

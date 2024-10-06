import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import admin from "./routes/admin";
import tourist from "./routes/tourist";
import historical_location from "./routes/historical_location";
import mailer from "./routes/mailer";

import activity from "./routes/activity";
import category from "./routes/category";
import advertiser from "./routes/advertiser";
import historical_tag from "./routes/historical_tag";
import product from "./routes/product";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  admin(app);
  tourist(app);
  historical_location(app);
  activity(app);
  category(app);
  advertiser(app);
  historical_tag(app);
  mailer(app);
  product(app);

  return app;
};

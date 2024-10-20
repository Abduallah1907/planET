import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import tourGuide from "./routes/tourGuide";
import admin from "./routes/admin";
import tourist from "./routes/tourist";
import historical_location from "./routes/historical_location";
import mailer from "./routes/mailer";

import activity from "./routes/activity";
import category from "./routes/category";
import advertiser from "./routes/advertiser";
import historical_tag from "./routes/historical_tag";
import product from "./routes/product";
import itinerary from "./routes/itinerary";
import file from "./routes/file";
import slot from "./routes/slot";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourGuide(app);
  admin(app);
  tourist(app);
  historical_location(app);
  activity(app);
  category(app);
  advertiser(app);
  historical_tag(app);
  mailer(app);
  product(app);
  itinerary(app);
  file(app);
  slot(app);

  return app;
};

import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import tourist from "./routes/tourist";
import historical_location from "./routes/historical_location";
import activity from "./routes/activity";
import category from "./routes/category";
import advertiser from "./routes/advertiser";
import historical_tag from "./routes/historical_tag";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourist(app);
  historical_location(app);
  activity(app);
  category(app);
  advertiser(app);
  historical_tag(app);
  return app;
};

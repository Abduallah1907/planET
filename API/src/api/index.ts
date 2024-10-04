import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import tourist from "./routes/tourist";
import historical_location from "./routes/historical_location";
import activity from "./routes/activity";
import category from "./routes/category";
import advertiser from "./routes/advertiser";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourist(app);
  historical_location(app);
  activity(app);
  category(app);
  advertiser(app);
  return app;
};

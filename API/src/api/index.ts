import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import tourist from "./routes/tourist";

import activity from "./routes/activity";
import historical_location from "./routes/Historical_location";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourist(app);
  historical_location(app);
  activity(app);
  return app;
};

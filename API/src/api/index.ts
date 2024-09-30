import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import tourist from "./routes/tourist";

import activity from "./routes/activity";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourist(app);

  activity(app);
  return app;
};

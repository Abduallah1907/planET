import { Router } from "express";
import user from "./routes/user";
import seller from "./routes/seller";
import activity from "./routes/activity";
export default () => {
  const app = Router();

  user(app);
  seller(app);
  activity(app);
  return app;
};

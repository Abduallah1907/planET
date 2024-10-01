import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";
import tourGuide from "./routes/tourGuide";
import admin from "./routes/admin";
import tourist from "./routes/tourist";

export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourGuide(app);
  admin(app);
  tourist(app);

  return app;
};

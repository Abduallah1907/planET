import { Router } from "express";
import user from "./routes/user";
import seller from "./routes/seller";
import tourGuide from "./routes/tourGuide";

export default () => {
  const app = Router();

  user(app);
  seller(app);
  tourGuide(app);
  return app;
};

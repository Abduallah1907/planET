import { Router } from "express";
import user from "./routes/user";
import seller from "./routes/seller";
import admin from "./routes/admin";

export default () => {
  const app = Router();

  user(app);
  seller(app);
  admin(app);

  return app;
};

import { Router } from "express";

import user from "./routes/user";
import seller from "./routes/seller";

export default () => {
  const app = Router();

  user(app);
  app.use("/seller", seller);

  return app;
};

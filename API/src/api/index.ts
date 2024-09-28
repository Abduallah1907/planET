import { Router } from "express";
import adminRoutes from "./routes/admin";
import user from "./routes/user";
import seller from "./routes/seller";

export default () => {
  const app = Router();

  user(app);
  seller(app);
  app.use("/admin", adminRoutes);
  return app;
};

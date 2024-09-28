import { Router } from "express";
import adminRoutes from "./routes/admin";

export default () => {
  const app = Router();
  app.use("/admin", adminRoutes);
  return app;
};

import { Router } from "express";
import sellerRouter from "./routes/sellerRoute";
import userRouter from "./routes/userRoute";

export default () => {
  const app = Router();

  app.use("/user", userRouter);

  app.use("/seller", sellerRouter);



  return app;
};

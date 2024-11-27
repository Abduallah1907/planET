import { Router } from "express";
import Container from "typedi";
import { SellerController } from "@/api/controllers/sellerController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
const route = Router();

export default (app: Router) => {
  const sellerController: SellerController = Container.get(SellerController);

  app.use("/seller", route);
  route.post("/createSeller", sellerController.createSeller);
  route.get(
    "/getSeller/:email",
    authorize([UserRoles.Seller]),
    sellerController.getSeller
  );
  route.put(
    "/updateSeller/:searchEmail",
    authorize([UserRoles.Seller]),
    sellerController.updateSeller
  );
  route.delete(
    "/deleteSellerAccountRequest/:email",
    sellerController.deleteSellerAccountRequest
  );
  route.get(
    "/getSalesReport/:email",
    authorize([UserRoles.Seller]),
    sellerController.getSalesReport
  );
};

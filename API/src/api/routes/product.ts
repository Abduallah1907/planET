import { Router } from "express";
import { Container } from "typedi";
import { ProductController } from "../controllers/productController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";
import { get } from "http";
import getRoleAndID from "../middlewares/getRole";

const route = Router();
export default (app: Router) => {
  const productController: ProductController = Container.get(ProductController);
  app.use("/product", route);

  route.post(
    "/createProduct/:seller_id",
    authorize([UserRoles.Seller]),
    productController.createProduct
  );

  route.put(
    "/updateProduct/:product_id",
    authorize([UserRoles.Seller]),
    productController.updateProduct
  );

  route.get(
    "/getFilterComponents",
    getRoleAndID,
    productController.getFilterComponents
  );
  route.get(
    "/getFilteredProducts",
    getRoleAndID,
    productController.getFilteredProducts
  );
  route.get(
    "/getSortedProducts",
    getRoleAndID,
    productController.getSortedProducts
  );
  route.get("/getAllProducts", getRoleAndID, productController.getAllProducts);
  route.get(
    "/getProductsBySellerId/:seller_id",
    productController.getProductsBySellerId
  );
  // the below api isn't even called lmao, eshtemo fe team el frontend
  route.get(
    "/getProductByName/:product_name",
    productController.getProductByName
  );
  route.get("/getProductByID/:id", productController.getProductById);
  route.get("/getComments/:product_id", productController.getComments);
};

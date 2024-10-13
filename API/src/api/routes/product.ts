import { Router } from "express";
import { Container } from "typedi";
import { ProductController } from "../controllers/productController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";

const route = Router();
export default (app: Router) => {
  const productController: ProductController = Container.get(ProductController);
  app.use("/product", route);

  route.post("/createProduct/:seller_id", authorize([UserRoles.Seller]), productController.createProduct);

  route.put("/updateProduct/:product_id", authorize([UserRoles.Seller]), productController.updateProduct);

  route.get("/getFilteredProducts", productController.getFilteredProducts);
  route.get("/getSortedProducts", productController.getSortedProducts);
  route.get("/getAllProducts", productController.getAllProducts);
  route.get("/getProductByName/:product_name", productController.getProductByName);
  route.get("/getProductByID/:id", productController.getProductById);
  route.get("/getFilterComponents", productController.getFilterComponents);
};

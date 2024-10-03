import { Router } from "express";
import { Container } from "typedi";
import { ProductController } from "../controllers/productController";

const route = Router();
export default (app: Router) => {
  const productController: ProductController = Container.get(ProductController);
  app.use("/product", route);
  /**
   * @swagger
   *
   * /api/product/getFilteredProducts:
   *   get:
   *     description: Get filtered products
   *     tags:
   *       - Product
   *     parameters:
   *       - in: query
   *         name: price
   *         schema:
   *           type: string
   *         description: Price range
   *     responses:
   *       200:
   *         description: Filtered products are fetched
   *       500:
   *         description: Internal Server Error
   */

  route.get("/getFilteredProducts", productController.getFilteredProducts);
};

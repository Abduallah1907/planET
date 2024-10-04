import { Router } from "express";
import { Container } from "typedi";
import { ProductController } from "../controllers/productController";

const route = Router();
export default (app: Router) => {
  const productController: ProductController = Container.get(ProductController);
  app.use("/product", route);
  /**
   * @swagger
   * /api/product/createProduct:
   *   post:
   *     description: Create a product
   *     tags:
   *       - Product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Product name
   *               description:
   *                 type: string
   *                 description: Product description
   *               picture:
   *                 type: string
   *                 description: Product picture
   *               price:
   *                 type: number
   *                 description: Product price
   *               quantity:
   *                 type: number
   *                 description: Product quantity
   *               sales:
   *                 type: number
   *                 description: Product sales
   *               archieve_flag:
   *                 type: boolean
   *                 description: Product archieve flag
   *             required:
   *               - name
   *               - description
   *               - picture
   *               - price
   *               - quantity
   *               - sales
   *     responses:
   *       201:
   *         description: Product is created
   *       500:
   *         description: Internal Server Error
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
  route.post("/createProduct", productController.createProduct);

  route.get("/getFilteredProducts", productController.getFilteredProducts);
};

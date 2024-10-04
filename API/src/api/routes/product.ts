import { Router } from "express";
import { Container } from "typedi";
import { ProductController } from "../controllers/productController";

const route = Router();
export default (app: Router) => {
  const productController: ProductController = Container.get(ProductController);
  app.use("/product", route);
  /**
   * @swagger
   * /api/product/createProduct/{user_id}:
   *   post:
   *     description: Create a product and linking it to the seller with his user_id
   *     tags:
   *       - Product
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: string
   *         description: user_id of the seller
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
   * /api/product/updateProduct/{product_id}:
   *   put:
   *     description: Update a product
   *     tags:
   *       - Product
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: string
   *         description: Product id
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
   *     responses:
   *       200:
   *         description: Product is updated
   *       404:
   *         description: Product not found
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

  route.post("/createProduct/:user_id", productController.createProduct);

  route.put("/updateProduct/:product_id", productController.updateProduct);
  route.get("/getFilteredProducts", productController.getFilteredProducts);
};

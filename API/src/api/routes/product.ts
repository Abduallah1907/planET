import { Router } from "express";
import { Container } from "typedi";
import { ProductController } from "../controllers/productController";
import authorize from "../middlewares/authorize";
import UserRoles from "@/types/enums/userRoles";

const route = Router();
export default (app: Router) => {
  const productController: ProductController = Container.get(ProductController);
  app.use("/product", route);
  /**
   * @swagger
   * /api/product/createProduct/{user_id}:
   *   post:
   *     description: Create a product and link it to the seller with their user_id
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
   *                 description: Product archive flag
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
   *                 description: Product archive flag
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
   * /api/product/getSortedProducts:
   *   get:
   *     tags:
   *       - Product
   *     summary: Get sorted products
   *     description: Get sorted products by ratings and price and direction 1=Asc and -1=Desc
   *     parameters:
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Sort criteria
   *       - in: query
   *         name: direction
   *         schema:
   *           type: number
   *         description: Sort direction
   *     responses:
   *       200:
   *         description: Sorted products are fetched
   *       500:
   *         description: Internal Server Error
   * /api/product/getAllProducts:
   *   get:
   *     tags:
   *       - Product
   *     summary: Get all products
   *     description: Get all products
   *     responses:
   *       200:
   *         description: All products are fetched
   *       500:
   *         description: Internal Server Error
   * /api/product/getProductByName/{product_name}:
   *   get:
   *     tags:
   *       - Product
   *     summary: Get product by name
   *     description: Get product by name
   *     parameters:
   *       - in: path
   *         name: product_name
   *         required: true
   *         schema:
   *           type: string
   *         description: Product name
   *     responses:
   *       200:
   *         description: Product is fetched
   *       404:
   *         description: Product not found
   *       500:
   *         description: Internal Server Error
   * /api/product/getFilterComponents:
   *   get:
   *     tags:
   *       - Product
   *     summary: Get filter components
   *     description: Get filter components
   *     responses:
   *       200:
   *         description: Filter components are fetched
   *       500:
   *         description: Internal Server Error
   */

  route.post(
    "/createProduct/:user_id",
    authorize([UserRoles.Seller]),
    productController.createProduct
  );

  route.put(
    "/updateProduct/:product_id",
    authorize([UserRoles.Seller]),
    productController.updateProduct
  );

  route.get(
    "/getFilteredProducts",
    authorize([UserRoles.Tourist, UserRoles.Seller]),
    productController.getFilteredProducts
  );
  route.get(
    "/getSortedProducts",
    authorize([UserRoles.Tourist, UserRoles.Seller]),
    productController.getSortedProducts
  );
  route.get(
    "/getAllProducts",
    productController.getAllProducts
  );
  route.get(
    "/getProductByName/:product_name",
    productController.getProductByName
  );
  route.get("/getFilterComponents", productController.getFilterComponents);
};

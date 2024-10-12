import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
const router = Router();
export default (app: Router) => {
  const categoryController: CategoryController =
    Container.get(CategoryController);

  app.use("/category", router);

  /**
   * @swagger
   * /api/category/createCategory:
   *   post:
   *     summary: Create a new category
   *     tags: [Category]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "New Category"
   *     responses:
   *       201:
   *         description: Category created successfully
   *       400:
   *         description: Bad request
   */
  router.post(
    "/createCategory",
    authorize([]),
    categoryController.createCategory
  );

  /**
   * @swagger
   * /api/category/getAllCategories:
   *   get:
   *     summary: Get all categories
   *     tags: [Category]
   *     responses:
   *       200:
   *         description: A list of categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "123"
   *                   name:
   *                     type: string
   *                     example: "Category Name"
   */
  router.get(
    "/getAllCategories",
    categoryController.getAllCategories
  );

  /**
   * @swagger
   * /api/category/getCategoryByID/{id}:
   *   get:
   *     summary: Get a category by ID
   *     tags: [Category]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The category ID
   *     responses:
   *       200:
   *         description: Category details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "123"
   *                 name:
   *                   type: string
   *                   example: "Category Name"
   *       404:
   *         description: Category not found
   */
  router.get(
    "/getCategoryByID/:id",
    authorize([]),
    categoryController.getCategoryByID
  );

  /**
   * @swagger
   * /api/category/updateCategory/{id}:
   *   put:
   *     summary: Update a category by ID
   *     tags: [Category]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The category ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Updated Category Name"
   *     responses:
   *       200:
   *         description: Category updated successfully
   *       400:
   *         description: Bad request
   *       404:
   *         description: Category not found
   */
  router.put(
    "/updateCategory/:id",
    authorize([]),
    categoryController.updateCategory
  );

  /**
   * @swagger
   * /api/category/deleteCategory/{id}:
   *   delete:
   *     summary: Delete a category by ID
   *     tags: [Category]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The category ID
   *     responses:
   *       200:
   *         description: Category deleted successfully
   *       404:
   *         description: Category not found
   */
  router.delete(
    "/deleteCategory/:id",
    authorize([]),
    categoryController.deleteCategory
  );
};

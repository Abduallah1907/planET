import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import Container from "typedi";
import authorize from "../middlewares/authorize";
const router = Router();
export default (app: Router) => {
  const categoryController: CategoryController = Container.get(CategoryController);

  app.use("/category", router);

  router.post("/createCategory", authorize([]), categoryController.createCategory);

  router.get("/getAllCategories", categoryController.getAllCategories);

  router.get("/getCategoryByID/:id", authorize([]), categoryController.getCategoryByID);

  router.put("/updateCategory/:id", authorize([]), categoryController.updateCategory);

  router.delete("/deleteCategory/:id", authorize([]), categoryController.deleteCategory);
};

import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import Container from "typedi";
const router = Router();
export default (app: Router) => {
  const categoryController: CategoryController =
    Container.get(CategoryController);

  app.use("/category", router);
  router.post("/createCategory", categoryController.createCategory);
  router.get("/getAllCategories", categoryController.getAllCategories);
  router.get("/getCategoryByID/:id", categoryController.getCategoryByID);
  router.put("/updateCategory/:id", categoryController.updateCategory);
  router.delete("/deleteCategory/:id", categoryController.deleteCategory);
};

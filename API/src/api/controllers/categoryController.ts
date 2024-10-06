import { ICategoryDTO } from "@/interfaces/ICategory";
import CategoryService from "@/services/categoryService";
import Container, { Service } from "typedi";

@Service()
export class CategoryController {
  //Create category
  public async createCategory(req: any, res: any) {
    const categoryService: CategoryService = Container.get(CategoryService);
    const categoryData = req.body as ICategoryDTO;
    const category = await categoryService.createCategoryService(categoryData);
    res.status(category.status).json({ category });
  }
  //Get all Categories in the DB
  public async getAllCategories(req: any, res: any) {
    const categoryService: CategoryService = Container.get(CategoryService);
    const categories = await categoryService.getAllCategoriesService();
    res.status(categories.status).json({ categories });
  }
  //Get category using ID
  public async getCategoryByID(req: any, res: any) {
    const { id } = req.params;
    const categoryService: CategoryService = Container.get(CategoryService);
    const category = await categoryService.getCategoryByIDService(id);
    res.status(category.status).json({ category });
  }
  //Update category, I only updated category type
  public async updateCategory(req: any, res: any) {
    const { id } = req.params;
    const categoryService: CategoryService = Container.get(CategoryService);
    const category = await categoryService.updateCategoryService(id, req.body);
    res.status(category.status).json({ category });
  }
  //Delete category
  public async deleteCategory(req: any, res: any) {
    const { id } = req.params;
    const categoryService: CategoryService = Container.get(CategoryService);
    const category = await categoryService.deleteCategoryService(id);
    res.status(category.status).json({ category });
  }
}

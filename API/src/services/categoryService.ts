import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/types/Errors";
import response from "@/types/responses/response";
import { Inject, Service } from "typedi";
import { Types } from "mongoose";
import { ICategoryDTO } from "@/interfaces/ICategory";
@Service()
export default class CategoryService {
  constructor(
    @Inject("categoryModel") private categoryModel: Models.CategoryModel
  ) {}
  //create Category
  public createCategoryService = async (categoryDatainput: ICategoryDTO) => {
    const categoryData: ICategoryDTO = {
      type: categoryDatainput.type,
    };
    //Check if it is unique or not
    const existingCategory = await this.categoryModel.findOne({
      type: categoryData.type,
    });
    if (existingCategory) {
      throw new BadRequestError("Type must be unique,choose another type");
    }
    if (!categoryData.type) {
      throw new BadRequestError("Type is required");
    }
    const category = await this.categoryModel.create(categoryData);

    if (category instanceof Error)
      throw new InternalServerError("Internal server error");
    if (category == null) throw new NotFoundError("Cannot be created");
    return new response(true, category, "Created successfuly", 201);
  };
  //get all Categories
  public getAllCategoriesService = async () => {
    const categories = await this.categoryModel.find({});
    if (categories instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (categories == null) {
      throw new NotFoundError("No Categories Found");
    }
    return new response(true, categories, "All categories are fetched", 200);
  };
  //get category by ID
  public getCategoryByIDService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const category = await this.categoryModel.findById(new Types.ObjectId(id));
    if (category instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (category == null) {
      throw new NotFoundError("Category not found");
    }
    return new response(true, category, "Category found", 200);
  };
  //update category
  public updateCategoryService = async (
    id: string,
    categoryDatainput: ICategoryDTO
  ) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const categoryData: ICategoryDTO = {
      type: categoryDatainput.type,
    };
    if (!categoryData.type) {
      throw new BadRequestError("Type is required");
    }
    const existingCategory = await this.categoryModel.findOne({
      type: categoryDatainput.type,
    });
    if (existingCategory) {
      throw new BadRequestError("Type must be unique,choose another type");
    }

    const category = await this.categoryModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      categoryData,
      { new: true }
    );
    if (category instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (category == null) {
      throw new NotFoundError("Category not found");
    }
    return new response(true, category, "Category updated", 200);
  };
  //Delete category
  public deleteCategoryService = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const category = await this.categoryModel.findByIdAndDelete(
      new Types.ObjectId(id)
    );
    if (category instanceof Error) {
      throw new InternalServerError("Internal server error");
    }
    if (category == null) {
      throw new NotFoundError("Category not found");
    }
    return new response(true, null, "Category deleted", 200);
  };
}

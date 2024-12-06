import { IFilterComponents } from "@/interfaces/IFilterComponents";
import { IProduct, IProductInputDTO } from "@/interfaces/IProduct";
import { BadRequestError, InternalServerError, NotFoundError } from "@/types/Errors";
import response from "@/types/responses/response";
import { Service, Inject } from "typedi";
import { ObjectId, Types } from "mongoose";

import { ObjectId as MongoObjectID } from "mongodb";
import UserRoles from "@/types/enums/userRoles";
import User from "@/models/user";

@Service()
export class ProductService {
  constructor(
    @Inject("productModel") private productModel: Models.ProductModel,
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("userModel") private userModel: Models.UserModel
  ) {}

  public async createProductService(seller_id: Types.ObjectId, product: IProductInputDTO) {
    const newProduct = new this.productModel({
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      quantity: product.quantity,
      sales: 0,
      archieve_flag: product.archieve_flag,
      seller_id: seller_id,
    });

    const resultProduct = await newProduct.save();

    if (resultProduct instanceof Error) throw new InternalServerError("Internal Server Error cannot save product");

    const product_id = resultProduct._id as ObjectId;

    const seller = await this.sellerModel.findById(seller_id);

    if (!seller) throw new Error("Seller is not found");
    if (seller instanceof Error) throw new InternalServerError("Internal Server Error cannot find seller");

    seller.products.push(product_id);
    const newSeller = await seller.save();
    if (newSeller instanceof Error) throw new InternalServerError("Internal Server Error cannot save seller");

    return new response(true, resultProduct, "Product is created", 201);
  }

  public async updateProductService(product_id: string, product: IProductInputDTO) {
    const updatedProduct = await this.productModel.findByIdAndUpdate(product_id, { ...product }, { new: true });
    if (updatedProduct instanceof Error) throw new InternalServerError("Internal Server Error");

    if (!updatedProduct) throw new NotFoundError("Product not found");

    return new response(true, updatedProduct, "Product is updated", 200);
  }

  public async getFilteredProductsService(
    filters: {
      price?: {
        min?: number;
        max?: number;
      };
      seller_id?: string;
    },
    role: string
  ) {
    if (!filters || Object.keys(filters).length === 0 || (filters.seller_id && Object.keys(filters).length === 1)) {
      const checks: any = {};
      if (filters.seller_id) {
        checks.seller_id = filters.seller_id;
      } else if (role !== UserRoles.Admin) {
        checks.archieve_flag = false;
      }
      const products = await this.productModel.find(checks);
      return new response(false, products, "No filters provided", 200);
    }

    const matchStage: any = {};
    if (filters.seller_id) {
      matchStage.seller_id = new MongoObjectID(filters.seller_id);
    } else if (role !== UserRoles.Admin) {
      matchStage.archieve_flag = false;
    }

    if (filters.price) {
      if (filters.price.min !== undefined) {
        matchStage.price = { ...matchStage.price, $gte: filters.price.min };
      }
      if (filters.price.max !== undefined) {
        matchStage.price = { ...matchStage.price, $lte: filters.price.max };
      }
    }
    const products = await this.productModel.aggregate([
      //Not nessesary to use aggregate here
      {
        $match: matchStage,
      },
      {
        $addFields: {
          reviews_count: { $size: "$comments" },
        },
      },
    ]);
    if (products instanceof Error) throw new InternalServerError("Internal Server Error");
    return new response(true, products, "Filtered products are fetched", 200);
  }
  public async getSortedProductsService(sort: string, direction: string, role: string) {
    const sortCriteria: any = {};
    if (role !== UserRoles.Admin) {
      sortCriteria.archieve_flag = false;
    }
    if (!sort && !direction) {
      const products = await this.productModel.find();
      return new response(true, products, "Products with no sort provided", 200);
    }
    if (sort === "ratings") {
      sortCriteria.average_rating = parseInt(direction);
    } else if (sort === "price") {
      sortCriteria.price = parseInt(direction);
    } else {
      throw new BadRequestError("Invalid sort criteria");
    }
    const products = await this.productModel.find().sort(sortCriteria);
    if (products instanceof Error) throw new InternalServerError("Internal Server Error");

    return new response(true, products, "Sorted products are fetched", 200);
  }

  public async getAllProductsService(role: string) {
    // why aggregate
    const productCriteria: any = {};
    if (role !== UserRoles.Admin) {
      productCriteria.archieve_flag = false;
    }
    const products = await this.productModel.aggregate([
      { $match: productCriteria },
      {
        $addFields: {
          reviews_count: { $size: "$comments" },
        },
      },
    ]);

    if (products instanceof Error) throw new InternalServerError("Internal Server Error");

    return new response(true, products, "All products are fetched", 200);
  }

  public async getProductsBySellerIdService(seller_id: string) {
    const productCriteria: any = {};
    productCriteria.seller_id = seller_id;
    const products = await this.productModel.aggregate([
      { $match: productCriteria },
      {
        $addFields: {
          reviews_count: { $size: "$comments" },
        },
      },
    ]);
    if (products instanceof Error) throw new InternalServerError("Internal Server Error");

    return new response(true, products, "Products are fetched", 200);
  }

  public async getProductByIdService(product_id: Types.ObjectId) {
    const product = await this.productModel.findById(product_id);
    if (product instanceof Error) throw new InternalServerError("Internal Server Error");
    if (!product) throw new NotFoundError("Product not found");
    return new response(true, product, "Product is fetched", 200);
  }
  public async getProductByNameService(product_name: string) {
    const product = await this.productModel.findOne({ name: product_name });
    if (product instanceof Error) throw new InternalServerError("Internal Server Error");
    if (!product) throw new NotFoundError("Product not found");
    return new response(true, product, "Product is fetched", 200);
  }
  public async getFilterComponentsService(role: string) {
    const productCriteria: any = {};
    if (role !== UserRoles.Admin) {
      productCriteria.archieve_flag = false;
    }
    const cheapestProduct = await this.productModel.findOne(productCriteria).sort({ price: 1 }).limit(1).select("price");
    if (cheapestProduct instanceof Error) throw new InternalServerError("Internal Server Error fetching cheapest product");

    const highestProduct = await this.productModel.findOne(productCriteria).sort({ price: -1 }).limit(1).select("price");
    if (highestProduct instanceof Error) throw new InternalServerError("Internal Server Error fetching highest product");

    if (!cheapestProduct) throw new NotFoundError("Cheapest product not found");
    if (!highestProduct) throw new NotFoundError("Highest product not found");

    const filterComponents: IFilterComponents = {
      Price: {
        min: cheapestProduct?.price ?? 0,
        max: highestProduct?.price ?? 0,
        type: "slider",
      },
    };
    return new response(true, filterComponents, "Cheapest and highest products are fetched", 200);
  }
}

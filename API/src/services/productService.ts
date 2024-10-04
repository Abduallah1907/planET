import { IProduct } from "@/interfaces/IProduct";
import { InternalServerError } from "@/types/Errors";
import response from "@/types/responses/response";
import { Service, Inject } from "typedi";

@Service()
export class ProductService {
  constructor(
    @Inject("productModel") private productModel: Models.ProductModel,
    @Inject("sellerModel") private sellerModel: Models.SellerModel,
    @Inject("userModel") private userModel: Models.UserModel
  ) {}

  public async createProductService(user_id: number, product: IProduct) {
    const newProduct = new this.productModel({
      ...product,
      user_id,
    });

    const resultProduct = await newProduct.save();

    if (resultProduct instanceof Error)
      throw new InternalServerError(
        "Internal Server Error cannot save product"
      );

    const product_id = resultProduct._id;

    const seller = await this.sellerModel.findOne({ user_id });

    if (!seller) throw new Error("Seller is not found");
    if (seller instanceof Error)
      throw new InternalServerError("Internal Server Error cannot find seller");

    seller.products.push(product_id);
    const newSeller = await seller.save();
    if (newSeller instanceof Error)
      throw new InternalServerError("Internal Server Error cannot save seller");

    return new response(true, resultProduct, "Product is created", 201);
  }

  public async getFilteredProductsService(filters: {
    price?: {
      min?: number;
      max?: number;
    };
  }) {
    if (!filters) {
      const products = await this.productModel.find();
      return new response(false, products, "No filters provided", 200);
    }

    const matchStage: any = {};

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
    ]);
    console.log("result", products);
    console.log("match", matchStage);

    if (products instanceof Error)
      throw new InternalServerError("Internal Server Error");
    return new response(true, products, "Filtered products are fetched", 200);
  }
}

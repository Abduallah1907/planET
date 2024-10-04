import { Service } from "typedi";
import { ProductService } from "../../services/productService";
import { Container } from "typedi";
import { IProduct, IProductInputDTO } from "../../interfaces/IProduct";

@Service()
export class ProductController {
  public async createProduct(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const product: IProduct = req.body;
    const { user_id } = req.params;
    const result = await productService.createProductService(user_id, product);
    console.log("result", result);
    res.status(result.status).json({ result });
  }

  public async updateProduct(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const product: IProductInputDTO = req.body;
    const { product_id } = req.params;
    const updatedProduct = await productService.updateProductService(
      product_id,
      product
    );
    res.status(updatedProduct.status).json({ updatedProduct });
  }

  public async getFilteredProducts(req: any, res: any) {
    const { price } = req.query;
    const productService: ProductService = Container.get(ProductService);
    var filters = {};
    if (price) {
      if (price.includes("-")) {
        filters = {
          ...filters,
          price: {
            min: parseFloat(price.split("-")[0]),
            max: parseFloat(price.split("-")[1]),
          },
        };
      } else {
        filters = {
          ...filters,
          price: {
            max: parseFloat(price),
          },
        };
      }
    }
    const products = await productService.getFilteredProductsService(filters);
    res.status(products.status).json({ products });
  }
}

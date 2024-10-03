import { Service } from "typedi";
import { ProductService } from "../../services/productService";
import { Container } from "typedi";

@Service()
export class ProductController {
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

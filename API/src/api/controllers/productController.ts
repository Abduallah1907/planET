import { Service } from "typedi";
import { ProductService } from "../../services/productService";
import { Container } from "typedi";
import { IProduct, IProductInputDTO } from "../../interfaces/IProduct";
import { Types } from "mongoose";

@Service()
export class ProductController {
  public async createProduct(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const product: IProduct = req.body;
    const { seller_id } = req.params;
    const newProduct = await productService.createProductService(
      seller_id,
      product
    );
    res.status(newProduct.status).json(newProduct);
  }

  public async updateProduct(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const product: IProductInputDTO = req.body;
    const { product_id } = req.params;
    const updatedProduct = await productService.updateProductService(
      product_id,
      product
    );
    res.status(updatedProduct.status).json(updatedProduct);
  }

  public async getFilteredProducts(req: any, res: any) {
    const { price, seller_id } = req.query;
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
    if (seller_id) {
      filters = {
        ...filters,
        seller_id: seller_id,
      };
    }
    const products = await productService.getFilteredProductsService(filters);
    res.status(products.status).json(products);
  }

  public async getSortedProducts(req: any, res: any) {
    const { sort, direction } = req.query;
    const productService: ProductService = Container.get(ProductService);
    const products = await productService.getSortedProductsService(
      sort,
      direction
    );
    res.status(products.status).json(products);
  }
  public async getAllProducts(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const products = await productService.getAllProductsService();
    res.status(products.status).json(products);
  }

  public async getProductsBySellerId(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const { seller_id } = req.params;
    const products = await productService.getProductsBySellerIdService(seller_id);
    res.status(products.status).json(products);
  }

  public async getProductByName(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const { product_name } = req.params;
    const product = await productService.getProductByNameService(product_name);
    res.status(product.status).json(product);
  }
  public async getProductById(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);    
    const { id } = req.params;
    const idObject = new Types.ObjectId(id);
    const product = await productService.getProductByIdService(idObject);
    res.status(product.status).json(product);
  }
  public async getFilterComponents(req: any, res: any) {
    const productService: ProductService = Container.get(ProductService);
    const filterComponent = await productService.getFilterComponentsService();
    res.status(filterComponent.status).json(filterComponent);
  }
}

import boom from "@hapi/boom";
import ProductStorage from "../database/storage/product.storage.js";

const storage = new ProductStorage();

class ProductService {
  async getProducts() {
    const product = await storage.getProducts();
    if (!product) throw boom.notFound("Not found!");
    return product;
  }

  async getProductById(id) {
    const product = await storage.getProductById(id);
    if (!product) throw boom.notFound("Not found!");
    return product; 
  }

  async createProduct(data, imageUrl) {
    await storage.createProduct(data, imageUrl); 
  }

  async updateProduct(id, data) {
    const product = await storage.updateProduct(id, data);
    if (!product) throw boom.notFound("Not found!");
  }

  async deleteProduct(id) {
    const product = await storage.deleteProduct(id);
    if (!product) throw boom.notFound("Not found!");
    return product;
  }
}

export default ProductService;
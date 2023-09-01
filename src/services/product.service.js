import boom from "@hapi/boom";
import fs from "fs-extra";
import ProductStorage from "../database/storage/product.storage.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

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

  async createProduct(data, image) {
    const result = await uploadImage(image, "products");
    const imageUrl = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    }
    await fs.unlink(image);
    await storage.createProduct(data, imageUrl); 
  }

  async updateProduct(id, data) {
    const product = await storage.updateProduct(id, data);
    if (!product) throw boom.notFound("Not found!");
  }

  async deleteProduct(id) {
    const product = await storage.deleteProduct(id);
    if (!product) throw boom.notFound("Not found!");
    await deleteImage(product.imageUrl.public_id);
  }
}

export default ProductService;
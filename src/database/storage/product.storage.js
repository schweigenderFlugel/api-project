import mongoose from "mongoose";
import { ProductModel } from "../connection.js";

class ProductStorage {
  async getProducts() {
    const product = await ProductModel.find();
    return product;
  }

  async getProductById(id) {
    const isValid = mongoose.isValidObjectId(id);
    if (isValid) {
      const product = await ProductModel.findOne({ _id: id });
      return product;
    }
  }

  async createProduct(data, imageUrl) {
    await ProductModel.create({
      ...data,
      imageUrl: imageUrl
    });
  }

  async updateProduct(id, data) {
    const isValid = mongoose.isValidObjectId(id);
    if (isValid) {
      const product = await ProductModel.findOneAndUpdate({
        _id: id,
        ...data
      })
      return product; 
    }
  }

  async deleteProduct(id) {
    const isValid = mongoose.isValidObjectId(id);
    if (isValid) {
      const product = await ProductModel.findOneAndDelete({ _id: id });
      return product;
    }
  }
}

export default ProductStorage;

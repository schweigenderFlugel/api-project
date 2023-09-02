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

  async createProduct(data, image) {
    await ProductModel.create({
      ...data,
      image: image
    });
  }

  async updateProduct(id, data, image) {
    const isValid = mongoose.isValidObjectId(id);
    if (isValid) {
      const product = await ProductModel.findOneAndUpdate({
        _id: id,
        ...data,
        image: image
      })
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

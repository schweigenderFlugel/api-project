import mongoose from "mongoose";
import { OrderModel, UserModel } from "../connection.js";

class OrderStorage {
  async getOrder(id) {
    const isValid = mongoose.isValidObjectId(id);
    if (isValid) {
      const order = await OrderModel.findOne({ _id: id })
        .populate({ path: "products", select: "name price" });
      return order;
    }
  }

  async createOrder(id, ordersNumber, data) {
    const objectId = new mongoose.Types.ObjectId;
    await OrderModel.create({
      _id: objectId,
      products: data.product,
      customer: id
    })
    await UserModel.findOneAndUpdate({
      _id: id,
      $push: { orders: objectId },
      ordersNumber: ordersNumber
    })
  }

  async updateOrder(id, data) {
    const isValid = mongoose.isValidObjectId(id);
    if (isValid) {
      const order = OrderModel.findOneAndUpdate({
        _id: id,
        productId: data.productId, 
      })
      return order;
    }
  }

  async deleteOrder(userId, id, ordersNumber) {
    const isValid = mongoose.isValidObjectId(id);
    if (isValid) {
      const order = OrderModel.findOneAndDelete({
        _id: id,
      })
      await UserModel.findOneAndUpdate({
        _id: userId,
        $pull: { orders: id },
        ordersNumber: ordersNumber
      })
    return order;
    }
  }
}

export default OrderStorage;

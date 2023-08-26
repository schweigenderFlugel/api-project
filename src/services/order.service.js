import boom from "@hapi/boom";
import OrderStorage from "../database/storage/order.storage.js";
import UserStorage from "../database/storage/user.storage.js";

const orderStorage = new OrderStorage();
const userStorage = new UserStorage();

class OrderService {
  async getOrder(id) {
    const order = await orderStorage.getOrder(id);
    if (!order) throw boom.notFound("Not found!");
    return order;
  }

  async createOrder(id, data) {
    const ordersNumber = await userStorage.getUserById(id);
    ordersNumber.ordersNumber = ordersNumber.ordersNumber + 1;
    await orderStorage.createOrder(id, ordersNumber.ordersNumber, data); 
  }

  async updateOrder(id, data) {
    const order = await orderStorage.updateOrder(id, data);
    if (!order) throw boom.notFound("Not found!"); 
  }

  async deleteOrder(userId, id) {
    const ordersNumber = await userStorage.getUserById(userId);
    ordersNumber.ordersNumber === 0 
      ? ordersNumber.ordersNumbers === 0
      : ordersNumber.ordersNumber - 1 ;
    const order = await orderStorage.deleteOrder(userId, id, ordersNumber.ordersNumber);
    // ATTENTION: THIS ERROR CAUSES A FAILURE IN THE API. 
    if (!order) throw boom.notFound("Not found!");
  }
}

export default OrderService;
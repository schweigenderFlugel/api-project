import { connect } from "mongoose";
import boom from "@hapi/boom";
import config from "../config/config.js";

import ProfileModel from "./model/profile.model.js";
import OrderModel from "./model/order.model.js";
import ProductModel from "./model/product.model.js";
import UserModel from "./model/user.model.js";

const mongoDbUri = config.enviroment === "test"
  ? config.mongoDbUriTest
  : config.mongoDbUri

connect(mongoDbUri)
  .then(() => console.log("Connected to mongodb!"))
  .catch((err) => {
    throw boom.internal(`It could'n connect to the database`);
  });

export { ProfileModel, OrderModel, ProductModel, UserModel };
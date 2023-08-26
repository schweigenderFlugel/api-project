import express from "express";
import boom from "@hapi/boom";
import passport from "passport";
import jwt from "jsonwebtoken";

import OrderService from "../services/order.service.js";
import config from "../config/config.js";
import validatorHandler from "../middlewares/validator.handler.js";
import createOrderSchema from "../schema/order.schema.js";
import checkRoles from "../middlewares/auth.handler.js";

const route = express.Router();
const service = new OrderService();

route.get("/:id", 
  passport.authenticate("jwt", { session: false }),
  checkRoles('customer', 'admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.getOrder(id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

route.post("/",
  passport.authenticate("jwt", { session: false }),
  checkRoles('customer', 'admin'),
  validatorHandler(createOrderSchema, "body"),
  async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) throw boom.notFound("UserId not found!");
      const refreshToken = cookies.jwt;

      jwt.verify(
        refreshToken,
        config.jwtRefreshSecret,
        async (error, decoded) => {
          if (error) {
            res.status(401).json({ message: "The refresh token is no longer valid!"}) 
          } else { 
            const id = decoded.sub;
            const data = req.body;
            await service.createOrder(id, data);
            res.status(201).json({ message: "Order created successfully!" });
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

route.patch("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRoles('customer', 'admin'),
  validatorHandler(createOrderSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await service.updateOrder(id, data);
      res.status(201).json({ message: "Order updated successfully!" })
    } catch (error) {
      next(error);
    }
  }
);

route.delete("/:id", 
  passport.authenticate("jwt", { session: false }),
  checkRoles('customer', 'admin'),
  async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) throw boom.notFound("UserId not found!");
      const refreshToken = cookies.jwt;

      jwt.verify(
        refreshToken,
        config.jwtRefreshSecret,
        async (error, decoded) => {
          if (error) {
            res.status(401).json({ message: "The refresh token is no longer valid!"}) 
          } else {
            const userId = decoded.sub;
            const { id } = req.params;
            await service.deleteOrder(userId, id);
            res.status(201).json({ message: "Order deleted successfully" });
          }
        }
      )
    } catch (error) {
      next(error)
    }
  }
)

export default route;

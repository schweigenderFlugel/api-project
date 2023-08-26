import express from "express";
import UserService from "../services/user.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import createUserSchema from "../schema/user.schema.js";

const service = new UserService();

const route = express.Router();

route.post("/",
  validatorHandler(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const data = req.body;
      await service.createUser(data);
      res.status(201).json({ message: "New user created!"});
    } catch (error) {
      next(error);
    }
  }
);

export default route;

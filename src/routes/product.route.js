import express from "express";
import passport from "passport";

import ProductService from "../services/product.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import { createProductSchema, updateProductSchema } from "../schema/product.schema.js";
import checkRoles from "../middlewares/auth.handler.js";

const route = express.Router();
const service = new ProductService();

route.get("/", async (req, res, next) => {
  try {
    const product = await service.getProducts();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await service.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

route.post("/",
  passport.authenticate("jwt", { session: false }),
  checkRoles('admin'),
  validatorHandler(createProductSchema, "body"),
  async (req, res, next) => {
    try {
      const data = req.body;
      const image = req.files.image.tempFilePath;
      await service.createProduct(data, image);
      res.status(201).json({ message: "Product created successfully!" });
    } catch (error) {
      next(error);
    }
  }
);

route.patch("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRoles('admin'),
  validatorHandler(updateProductSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await service.updateProduct(id, data);
      res.status(201).json({ message: "Product modified successfully!" });
    } catch (error) {
      next(error);
    }
  }
);

route.delete("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.deleteProduct(id);
      res.status(201).json({ message: "Product removed successfully!" });
    } catch (error) {
      next(error);
    }
  }
);

export default route;

import express from "express";
import fs from "fs-extra";
import UserService from "../services/user.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import createUserSchema from "../schema/user.schema.js";
import { uploadImage } from "../utils/cloudinary.js";

const service = new UserService();

const route = express.Router();

route.post("/",
  validatorHandler(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const data = req.body;
      const result = await uploadImage(req.files.image.tempFilePath, "users");
      const imageUrl = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      }
      await fs.unlink(req.files.image.tempFilePath);
      await service.createUser(data, imageUrl);
      res.status(201).json({ message: "New user created!"});
    } catch (error) {
      next(error);
    }
  }
);

export default route;

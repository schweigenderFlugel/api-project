import express from "express";
import UserService from "../services/user.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import createUserSchema from "../schema/user.schema.js";

const service = new UserService();

const route = express.Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    user: 
 *      type: object
 *      properties: 
 *        username: 
 *          type: string
 *          description: introduce username
 *        email: 
 *          type: string
 *          description: introduce email
 *        password: 
 *          type: string
 *          description: introduce username
 *        image: 
 *          type: string
 *          format: binary
 *      required:
 *        - username
 *        - email
 *        - password
 *        - image
 */

/**
 * @openapi
 * /api/v1/user:
 *  post:
 *    summary: create a new user
 *    tags: 
 *      [User]
 *    requestBody: 
 *      required: true 
 *      content: 
 *        multipart/form-data: 
 *            schema: 
 *              type: object
 *              $ref: '#/components/schemas/user'
 *    responses:
 *      200: 
 *        description: New user created!
 *      400: 
 *        description: Bad request! 
 *      409:
 *        description: Conflict! The username and email must be unique
 */
route.post("/",
  validatorHandler(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const data = req.body;
      const image = req.files.image.tempFilePath
      await service.createUser(data, image);
      res.status(201).json({ message: "New user created!"});
    } catch (error) {
      next(error);
    }
  }
);

export default route;

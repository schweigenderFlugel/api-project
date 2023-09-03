import express from "express";
import passport from "passport";

import ProductService from "../services/product.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import { createProductSchema, updateProductSchema } from "../schema/product.schema.js";
import checkRoles from "../middlewares/auth.handler.js";

const route = express.Router();
const service = new ProductService();

/**
 * @openapi
 * components:
 *  schemas: 
 *    product:
 *      properties: 
 *        name: 
 *          type: string
 *          description: name of the product
 *          example: pizza
 *        price: 
 *          type: integer
 *          description: price of the product
 *          example: 2000
 *        description: 
 *          type: string
 *          description: description of the product
 *          example: una verdadera bomba para el sistema gastro-intestinal
 *        image:
 *          type: object
 *          properties:
 *            public_id:
 *              type: string
 *              description: show the public id of the image in cloudinary
 *              example: products/bzl3dadpexielfwnt0di
 *            secure_url:
 *              type: string
 *              description: show the public id of the image in cloudinary
 *              example: https://res.cloudinary.com/dh1l5r94c/image/upload/v1693535126/products/bzl3dadpexielfwnt0di.jpg
 */

/**
 * @openapi
 * /api/v1/product:
 *  get:
 *    summary: get a list of products
 *    tags: [Product]
 *    responses: 
 *      200: 
 *        description: Shows a list of products
 *        content: 
 *          application/json:
 *            schema: 
 *              type: object
 *              $ref: '#/components/schemas/product'
 */
route.get("/", async (req, res, next) => {
  try {
    const product = await service.getProducts();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/v1/product/{id}:
 *  get:
 *    summary: get a product by id
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *          required: true
 *          description: the product id
 *    responses:
 *      200:
 *        description: Shows a specific product
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/product'
 *      404: 
 *        description: article not found
 */
route.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await service.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * components: 
 *  securitySchemes: 
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /api/v1/product:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: create a new article
 *    tags: [Product]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:  
 *          schema:
 *            type: object
 *            properties: 
 *              name: 
 *                type: string
 *                description: name of the product
 *              price: 
 *                type: Integer
 *                description: price of the product
 *              description: 
 *                type: string
 *                description: description of the product
 *              image:
 *                type: string
 *                format: binary
 *            required: 
 *              - name
 *              - price
 *              - description
 *              - image
 *    responses:
 *      201:
 *        description: A product was successfully created
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties: 
 *                message: 
 *                  type: string
 *                  description: message of success
 *                  example: Product created successfully!
 *        
 *      401: 
 *        description: Unauthorized!
 */
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

/**
 * @openapi
 * components: 
 *  securitySchemes: 
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /api/v1/product/{id}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    summary: update a product 
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *          required: true
 *          description: the product id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:  
 *          schema:
 *            type: object
 *            properties: 
 *              name: 
 *                type: string
 *                description: name of the product
 *              price: 
 *                type: Integer
 *                description: price of the product
 *              description: 
 *                type: string
 *                description: description of the product
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: the product was successfully updated 
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties: 
 *                message: 
 *                  type: string
 *                  description: message of success
 *                  example: Product updated successfully!
 *      404: 
 *        description: article not found
 *        
 */
route.patch("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRoles('admin'),
  validatorHandler(updateProductSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const image = req.files.image.tempFilePath;
      await service.updateProduct(id, data, image);
      res.status(201).json({ message: "Product modified successfully!" });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @openapi
 * components: 
 *  securitySchemes: 
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /api/v1/product/{id}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: get a product by id
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *          required: true
 *          description: the product id
 *    responses:
 *      200:
 *        description: the product was successfully removed 
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties: 
 *                message: 
 *                  type: string
 *                  description: message of success
 *                  example: Product removed successfully!
 *      404: 
 *        description: article not found
 */
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

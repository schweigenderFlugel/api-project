import express from "express";
import passport from "passport";

import OrderService from "../services/order.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import createOrderSchema from "../schema/order.schema.js";
import checkRoles from "../middlewares/auth.handler.js";

const route = express.Router();
const service = new OrderService();

/**
 * @openapi
 * components:
 *  schemas: 
 *    order:
 *      properties:
 *        _id: 
 *          type: string
 *          description: order id
 *          example: 64fd6589df13vn3lp8
 *        products: 
 *          type: array
 *          items:
 *             type: object
 *             properties: 
 *              _id: 
 *                type: string
 *                description: the id of the product
 *                example: 64saguiu58f1s25f445
 *              name: 
 *                type: string
 *                description: the name of the product
 *                example: pizza
 *              price: 
 *                type: integer
 *                description: the price of the product
 *                example: 3000
 *        customer: 
 *          type: string
 *          description: the id of the user
 *          example: 6423kpl84g6565swpt
 */

/**
 * @openapi
 * components: 
 *  securitySchemes: 
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /api/v1/order/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: get the order by id
 *    tags: [Order]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *          required: true
 *          description: the product id
 *    responses:
 *      200:
 *        description: shows the order of the user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/order'
 *      404: 
 *        description: article not found
 */
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

/**
 * @openapi
 * components: 
 *  securitySchemes: 
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /api/v1/order:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: create a new order
 *    tags: 
 *      [Order]
 *    requestBody: 
 *      required: true 
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            properties:
 *              products:
 *                type: array
 *                example: [64wd87f5gd5dfv5fv1s, 64dw8191318w9ssdfp]
 *            required:
 *              - products
 *    responses:
 *      201: 
 *        description: The order was successfully created!
 *      401: 
 *        description: Unauthorized!
 */
route.post("/",
  passport.authenticate("jwt", { session: false }),
  checkRoles('customer', 'admin'),
  validatorHandler(createOrderSchema, "body"),
  async (req, res, next) => {
    try {
      const id = req.user.sub;
      const data = req.body;
      await service.createOrder(id, data);
      res.status(201).json({ message: "Order created successfully!" });
          
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
 * /api/v1/order/{id}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    summary: update a product 
 *    tags: [Order]
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
 *        application/json:  
 *          schema:
 *            type: object
 *            properties: 
 *              products:
 *                type: array
 *                example: [64wd87f5gd5dfv5fv1s, 64dw8191318w9ssdfp]
 *    responses:
 *      200:
 *        description: The order was successfully updated 
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties: 
 *                message: 
 *                  type: string
 *                  description: message of success
 *                  example: Order updated successfully!
 *      404: 
 *        description: Order not found!
 *        
 */
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

/**
 * @openapi
 * components: 
 *  securitySchemes: 
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /api/v1/order/{id}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: delete order by id
 *    tags: [Order]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *          required: true
 *          description: the order id
 *    responses:
 *      200:
 *        description: The order was successfully removed 
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties: 
 *                message: 
 *                  type: string
 *                  description: message of success
 *                  example: Order removed successfully!
 *      404: 
 *        description: Order not found!
 */
route.delete("/:id", 
  passport.authenticate("jwt", { session: false }),
  checkRoles('customer', 'admin'),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const { id } = req.params;
      await service.deleteOrder(userId, id);
      res.status(201).json({ message: "Order deleted successfully" });
    } catch (error) {
      next(error)
    }
  }
)

export default route;

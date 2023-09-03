import express from "express";
import passport from "passport";
import ProfileService from "../services/profile.service.js";
import checkRoles from "../middlewares/auth.handler.js";

const route = express.Router();
const service = new ProfileService();

/**
 * @openapi
 * components:
 *  schemas: 
 *    profile:
 *      properties:
 *        _id: 
 *          type: string
 *          description: the id of the profile
 *          example: 64sdsd8sdf4ds86
 *        name: 
 *          type: string
 *          description: name of the user
 *          example: John
 *        lastName: 
 *          type: string
 *          description: last name of the user
 *          example: Doe
 *        street: 
 *          type: string
 *          description: the street name
 *          example: nowhere
 *        number: 
 *          type: string
 *          description: number of residence
 *          example: 000
 */

/**
 * @openapi
 * components: 
 *  securitySchemes: 
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * /api/v1/profile/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: get the profile
 *    tags: [Profile]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *          required: true
 *          description: the product id
 *    responses:
 *      200:
 *        description: shows the profile of the user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/profile'
 *      404: 
 *        description: article not found
 */
route.get("/:id",
  passport.authenticate("jwt", { session: false }),
  checkRoles('admin', 'customer'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const profile = await service.getProfile(id);
      res.status(200).json(profile);
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
 * /api/v1/profile/{id}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    summary: patch the profile
 *    tags: [Profile]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *          required: true
 *          description: the product id
 *    requestBody:
 *      content: 
 *        application/json:
 *          schema: 
 *            type: object
 *            $ref: '#/components/schemas/profile'
 *    responses:
 *      200:
 *        description: shows the profile of the user
 *        content:
 *          application/json:
 *            type: object
 *            properties:
 *              message: 
 *                type: string
 *                description: message of success
 *                example: Profile updated successfully!
 *      401: 
 *        description: Unauthorized!
 *      404: 
 *        description: Profile not found!
 */
route.patch("/:id", 
  passport.authenticate("jwt", { session: false }),
  checkRoles('admin', 'customer'),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body; 
      await service.updateProfile(id, data);
      res.status(201).json({ message: 'Profile updated' })
    } catch (error) {
      next(error);
    }
  }
  )

export default route;

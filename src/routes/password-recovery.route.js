import express from "express";
import PasswordRecoveryService from "../services/password-recovery.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import { newPassword, sendEmail } from "../schema/passoword-recovery.schema.js";

const service = new PasswordRecoveryService();

const route = express.Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    password-recovery: 
 *      type: object
 *      properties: 
 *        email: 
 *          type: string
 *          description: introduce email
 *          example: usuario@correo.com
 */

/**
 * @openapi
 * /api/v1/password-recovery/send-email:
 *  post:
 *    summary: sends a email in order to get a password recovery link
 *    tags: 
 *      [Password Recovery]
 *    requestBody: 
 *      required: true 
 *      content: 
 *        application/json:
 *            schema: 
 *              type: object
 *              $ref: '#/components/schemas/password-recovery'
 *    responses:
 *      200: 
 *        description: A email was sent successfully!
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties: 
 *                message: 
 *                  type: string
 *                  description: message of success
 *                  example: Email sent successfully!
 *        
 *      400: 
 *        description: Bad request!
 *      
 */
route.post('/send-email', 
  validatorHandler(sendEmail, 'body'),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      await service.sendPasswordRecovery(email);
      res.status(201).json({ message: "Email sent successfully" });
    } catch (error) {
      next(error)
    }
});

/**
 * @openapi
 * components:
 *  schemas:
 *    new-password: 
 *      type: object
 *      properties: 
 *        token: 
 *          type: string
 *          description: introduce token
 *          example: hufdsfdsvsd5sd168dw8d4d4f9s1d1f5s87f1s28d4f1sd5f1s
 *        password:
 *          type: string
 *          description: introduce a new password
 *          example: fafafa123456
 */

/**
 * @openapi
 * /api/v1/password-recovery/new-password:
 *  post:
 *    summary: sends a email in order to get a password recovery link
 *    tags: 
 *      [New Password]
 *    requestBody: 
 *      required: true 
 *      content: 
 *        application/json:
 *            schema: 
 *              type: object
 *              $ref: '#/components/schemas/new-password'
 *    responses:
 *      200: 
 *        description: A email was sent successfully
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties: 
 *                message: 
 *                  type: string
 *                  description: message of success
 *                  example: Email sent successfully!
 *        
 *      400: 
 *        description: Bad request!
 *      500: 
 *        description: Error! it's malformed token
 *      
 */
route.post("/new-password",
  validatorHandler(newPassword, 'body'),
  async (req, res, next) => {
    try {
      const { token, password } = req.body;
      await service.changePassword(token, password);
      res.status(201).json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  });

export default route;
  
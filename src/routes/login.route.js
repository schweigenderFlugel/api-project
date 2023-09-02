import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken"; 

import config from "../config/config.js";
import UserService from "../services/user.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import loginSchema from "../schema/login.schema.js";

const route = express.Router();
const service = new UserService();

/**
 * @openapi
 * components:
 *  schemas: 
 *    login:
 *      properties: 
 *        email: 
 *          type: string
 *          description: introduce email
 *        password: 
 *          type: string
 *          description: introduce username
 *      required:
 *        - email
 *        - password
 *      example: 
 *        email: usuario@correo.com
 *        password: user123456
 */

/**
 * @openapi
 * /api/v1/login:
 *  post:
 *    summary: login to get an access token and a refesh token
 *    tags: 
 *      [Login]
 *    requestBody: 
 *      required: true 
 *      content: 
 *        application/json:
 *            schema: 
 *              type: object
 *              $ref: '#/components/schemas/login'
 *    responses:
 *      200: 
 *        description: Successfully logged in!
 *        headers: 
 *          Set-Cookie:
 *            schema:
 *              type: string
 *              example: JSESSIONID=abcde123456; Path=/; HttpOnly
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: the user id from mongodb
 *                  example: 64sdbsdibdib8569
 *                username: 
 *                  type: string
 *                  description: show the username 
 *                  example: user123456
 *                profile: 
 *                  type: string
 *                  description: show the profile id of the user
 *                  example: 64sdsd8sdf4ds86
 *                role: 
 *                  type: string
 *                  description: show the role of the user
 *                  example: customer
 *                ordersNumber: 
 *                  type: integer
 *                  description: show the number of orders
 *                  example: 2
 *                orders:
 *                  type: array
 *                  description: show the orders ids
 *                  example: [64sdsdssdjsdjh85r6, 64ssjs89wr9f3sasd5]
 *                accessToken:
 *                  type: string
 *                  description: show the accessToken
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGYxMGNjOWVjY2NkYTZkZDI1MzM3NTMiLCJ1c2VybmFtZSI6ImZhY3VuZG8xMjMiLCJyb2xlIjoiYWRtaW4iLCJpYPQiOjE2OTM1MzUxMjEsIkV4cCI6MTY5MzUzNjMyMX0.VBd8v24sd83yNLLcEQX0jEXOHh9ciaITcZZ3Uo54dms
 *      401: 
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                statusCode:
 *                  type: string
 *                  description: show the status code
 *                  example: 401
 *                error:
 *                  type: string
 *                  description: show the error
 *                  example: Unauthorized
 *                message: 
 *                  type: string
 *                  description: show the cause of the error 
 *                  example: Password doesn't match
 *      404: 
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              properties:
 *                statusCode:
 *                  type: string
 *                  description: show the status code
 *                  example: 404
 *                error:
 *                  type: string
 *                  description: show the error
 *                  example: Not Found
 *                message: 
 *                  type: string
 *                  description: show the cause of the error 
 *                  example: User Not Found!
 */
route.post("/",
  validatorHandler(loginSchema, 'body'), 
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const user = req.user;
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role
        };

        const foundUser = await service.getUserById(user.id);

        const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '1d' });

        const newRefreshTokenArray = !cookies?.jwt 
        ? foundUser.refreshToken 
        : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        await service.saveRefreshToken(user.id, [...newRefreshTokenArray, refreshToken]);
        res.json({
          id: user._id,
          username: user.username,
          profile: user.profileId,
          role: user.role,
          ordersNumber: user.ordersNumber,
          orders: user.orders,
          accessToken: accessToken,
        });
    } catch (error) {
      next(error);
    }
  }
);

export default route;
import express from "express";
import boom from "@hapi/boom";

import UserService from '../services/user.service.js';

const route = express.Router();
const service = new UserService();

/**
 * @openapi
 * /api/v1/logout:
 *  get:
 *    summary: logout and delete the refresh token cookie
 *    tags: [Logout]
 *    responses: 
 *      200: 
 *        content: 
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: logout message
 *                  example: logout successfully
 *      404:
 *        description: Not Found!
 */
route.get("/", async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw boom.notFound("Not found");
    const refreshToken = cookies.jwt;

    const foundUser = await service.getUserByRefreshToken(refreshToken);

    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      throw boom.unauthorized("no match");
    }

    foundUser.refreshToken = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
    await service.saveRefreshToken(foundUser.id, foundUser.refreshToken);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    next(error);
  }
});

export default route;
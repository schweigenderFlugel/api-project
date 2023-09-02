import express from "express";
import jwt from "jsonwebtoken";
import boom from "@hapi/boom";
import UserService from "../services/user.service.js";
import config from "../config/config.js";

const route = express.Router();
const service = new UserService();

/**
 * @openapi
 * /api/v1/refresh-token:
 *  get:
 *    summary: new refresh token cookie
 *    tags: [Refresh Token]
 *    responses: 
 *      200: 
 *        description: New refresh token!
 *      404:
 *        description: Not Found!
 */
route.get('/', async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw boom.notFound("Not found");
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  
    const foundUser = await service.getUserByRefreshToken(refreshToken);
  
    // DETECTED REFRESH TOKEN REUSE!
    if (!foundUser) {
      jwt.verify(refreshToken, config.jwtRefreshSecret, async (err, decoded) => {
        if (err) throw boom.forbidden("Attempt of reusing a refresh Token");
        const hackedUser = await service.getUserById(decoded.sub);
        hackedUser.refreshToken = [];
        const result = await service.saveRefreshToken(decoded.sub, hackedUser.refreshToken);
        console.log(result);
      });
    }
  
    const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
  
    //EVALUATE A JWT
    jwt.verify(refreshToken, config.jwtRefreshSecret, async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        await service.saveRefreshToken(foundUser.id, foundUser.refreshToken);
        res.status(403).json({ message: "refresh token expired" });
      } else {
        const payload = {
          sub: decoded.sub,
          username: decoded.username,
        };
        const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "15m" });
        const newrefreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: "1d" });
  
        // SAVING REFRESH TOKEN
        foundUser.refreshToken = [...newRefreshTokenArray, newrefreshToken];
        await service.saveRefreshToken(foundUser.id, foundUser.refreshToken);
  
        res.cookie("jwt", newrefreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
      }
    }); 
  } catch (error) {
    next(error)
  }
});

export default route;
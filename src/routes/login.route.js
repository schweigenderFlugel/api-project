import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken"; 

import config from "../config/config.js";
import UserService from "../services/user.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import loginSchema from "../schema/login.schema.js";

const route = express.Router();
const service = new UserService();

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

        const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '5m' });
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
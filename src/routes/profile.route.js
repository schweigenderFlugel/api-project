import express from "express";
import passport from "passport";
import ProfileService from "../services/profile.service.js";
import checkRoles from "../middlewares/auth.handler.js";

const route = express.Router();
const service = new ProfileService();

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

route.patch("/:id", 
  passport.authenticate("jwt", { session: false }),
  checkRoles('admin', 'customer'),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body; 
      await service.updateProfile(id, data);
      res.status(201).json({ message: 'Profile updated'})
    } catch (error) {
      next(error);
    }
  }
  )

export default route;

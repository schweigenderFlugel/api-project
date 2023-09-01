import express from "express";
import PasswordRecoveryService from "../services/password-recovery.service.js";

const service = new PasswordRecoveryService();

const route = express.Router();

route.post('/send-email', async (req, res, next) => {
  try {
    const { email } = req.body;
    await service.sendPasswordRecovery(email);
    res.status(201).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error)
  }
});

route.post("/new-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await service.changePassword(token, password);
    res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
});

export default route;
  
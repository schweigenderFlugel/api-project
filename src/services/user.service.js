import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import boom from "@hapi/boom";
import UserStorage from "../database/storage/user.storage.js";
import config from "../config/config.js";

const storage = new UserStorage();

class UserService {
  async createUser(data) {
    try {
      data.password = await bcrypt.hash(data.password, 10);
      await storage.createUser(data);
      const mail = {
        from: "TESTING <sender@gmail.com>",
        to: data.email,
        subject: "Registro exitoso",
        text: "Se ha registrado exitosamente",
        html: "ingrese a nuestra página haciendo click en el siguiente siguiente link",
      };
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true,
        port: 587,
        auth: {
          user: config.gmailAddress,
          pass: config.gmailPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      transporter.sendMail(mail);
    } catch (error) {
      throw boom.conflict(error);
    }
  }

  async getUserByEmail(email) {
    const user = await storage.getUserByEmail(email);
    if (!user) throw boom.notFound("User Not Found!");
    return user;
  }

  async getUserById(id) {
    const user = await storage.getUserById(id);
    if (!user) throw boom.notFound("User Not Found!");
    return user;
  }

  async getUserByRefreshToken(refreshToken) {
    const user = await storage.getUserByRefreshToken(refreshToken);
    if (!user) throw boom.notFound("User Not Found!");
    return user;
  }

  async saveRefreshToken(id, refreshToken) {
    await storage.saveRefreshToken(id, refreshToken);
  }
}

export default UserService;
